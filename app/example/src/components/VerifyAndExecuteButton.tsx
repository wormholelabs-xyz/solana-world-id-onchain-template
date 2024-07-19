import { SolanaWorldIdProgram } from "@/target/types/solana_world_id_program";
import { parseIdKitResults } from "@/utils/parseIdKitResults";
import { postQuerySigs } from "@/utils/postQuerySigs";
import { queryMock } from "@/utils/queryMock";
import { requestAirdrop } from "@/utils/requestAirdrop";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import {
	EthCallQueryResponse,
	QueryProxyMock,
	QueryResponse,
} from "@wormhole-foundation/wormhole-query-sdk";
import { useState } from "react";
import idl from "../../../../target/idl/solana_world_id_onchain_template.json";
import worldIdIdl from "../target/idl/solana_world_id_program.json";
import { SolanaWorldIdOnchainTemplate } from "../target/types/solana_world_id_onchain_template";
import { WORLD_ID_PROGRAM_ID } from "../utils/constants";
import {
	deriveConfigKey,
	deriveGuardianSetKey,
	deriveLatestRootKey,
	deriveRootKey,
} from "../utils/pdaHelpers";
import { Button } from "./ui/button";

const ETH_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
// https://docs.wormhole.com/wormhole/reference/constants
const ETH_CHAIN_ID = 10002;
// https://etherscan.io/address/0xf7134CE138832c1456F2a91D64621eE90c2bddEa
const ETH_WORLD_ID_IDENTITY_MANAGER =
  "0x928a514350A403e2f5e3288C102f6B1CCABeb37C";

const devnetCoreBridgeAddress = new anchor.web3.PublicKey(
  "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
);

export function VerifyAndExecuteButton() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const provider = new anchor.AnchorProvider(connection, wallet as any, {
    commitment: "processed",
  });

  const worldIdProgram = new Program(
    worldIdIdl as any,
    provider
  ) as Program<SolanaWorldIdProgram>;

  const verifyAndExecute = async (idkitSuccessResult: ISuccessResult) => {
    if (!wallet.connected || !wallet.publicKey) return;
    setIsLoading(true);
    try {
      await requestAirdrop(connection, wallet.publicKey);

      const program = new Program(
        idl as any,
        provider
      ) as Program<SolanaWorldIdOnchainTemplate>;

      const { rootHash, nullifierHash, proof } = parseIdKitResults(
        idkitSuccessResult
      );

      const { mockQueryResponse } = await queryMock(
        new PublicKey(WORLD_ID_PROGRAM_ID),
        ETH_CHAIN_ID,
        ETH_RPC_URL,
        ETH_WORLD_ID_IDENTITY_MANAGER
      );

      const futureResponse = QueryResponse.from(mockQueryResponse.bytes);
      const mockEthCallQueryResponse = futureResponse.responses[0]
        .response as EthCallQueryResponse;
      mockEthCallQueryResponse.results[0] = idkitSuccessResult.merkle_root;
      const futureResponseBytes = futureResponse.serialize();
      const futureResponseSigs = new QueryProxyMock({}).sign(
        futureResponseBytes
      );
      const signatureSet = anchor.web3.Keypair.generate();

      const postQuerySigsInstruction = await postQuerySigs(
        futureResponseSigs,
        signatureSet,
        0,
        worldIdProgram
      );

      console.log(deriveGuardianSetKey(devnetCoreBridgeAddress, 0).toBase58());
      const guardianSet = deriveGuardianSetKey(devnetCoreBridgeAddress, 0);
      const rootKey = deriveRootKey(
        worldIdProgram.programId,
        Buffer.from(rootHash),
        0
      );
      const latestRootKey = deriveLatestRootKey(worldIdProgram.programId, 0);
      const config = deriveConfigKey(worldIdProgram.programId);
      const accountsToCheck = [guardianSet, rootKey, latestRootKey, config];
      let i = 0;
      for (const account of accountsToCheck) {
        const accountInfo = await connection.getAccountInfo(account);
        if (!accountInfo) {
          console.error(
            `Account ${account.toBase58()} (${i}) is not initialized.`
          );
        }
        i++;
      }

      const updateRootWithQueryInstruction = await worldIdProgram.methods
        .updateRootWithQuery(Buffer.from(futureResponseBytes), rootHash, 0)
        .accountsPartial({
          guardianSet: guardianSet,
          guardianSignatures: signatureSet.publicKey,
          root: rootKey,
          latestRoot: latestRootKey,
          config: config,
          refundRecipient: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const verifyAndExecuteInstruction = await program.methods
        .verifyAndExecute({
          rootHash: [
            ...Buffer.from(idkitSuccessResult.merkle_root.substring(2), "hex"),
          ],
          nullifierHash: nullifierHash,
          proof: proof,
        })
        .accounts({
          payer: provider.wallet.publicKey,
          root: rootKey,
          recipient: wallet.publicKey,
          config: config,
        })
        .accountsPartial({
          nullifier: anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("nullifier"), Buffer.from(nullifierHash)],
            program.programId
          )[0],
          worldIdProgram: WORLD_ID_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const transaction = new Transaction().add(
        postQuerySigsInstruction,
        updateRootWithQueryInstruction,
        verifyAndExecuteInstruction
      );
      // Get the latest blockhash and set it on the transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Set the feePayer to the wallet's public key
      transaction.feePayer = wallet.publicKey;

      // Sign the transaction with the signatureSet
      transaction.partialSign(signatureSet);

      // Sign the transaction with the wallet
      const signedTransaction = await wallet.signTransaction!(transaction);

      // Send and confirm the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(signature);

      console.log("Transaction signature", signature);
      alert("Verification successful!");
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      alert(
        "Verification failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IDKitWidget
      app_id={"app_staging_7d23b838b02776cebd87b86ac3248641"}
      action={"testing"}
      signal={`0x${new PublicKey("5yNbCZcCHeAxdmMJXcpFgmurEnygaVbCRwZNMMWETdeZ")
        .toBuffer()
        .toString("hex")}`}
      onSuccess={verifyAndExecute}
      autoClose
    >
      {({ open }) => (
        <Button
          onClick={open}
          disabled={!wallet.connected || isLoading}
          className="w-full mt-4"
        >
          {isLoading ? "Verifying..." : "Verify and Execute"}
        </Button>
      )}
    </IDKitWidget>
  );
}
