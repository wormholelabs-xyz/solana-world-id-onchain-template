import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { SolanaWorldIdOnchainTemplate } from "../target/types/solana_world_id_onchain_template";
import idl from "../../../../target/idl/solana_world_id_onchain_template.json";
import { WORLD_ID_PROGRAM_ID } from "../utils/constants";
import { deriveRootKey, deriveConfigKey } from "../utils/pdaHelpers";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

export function VerifyAndExecuteButton() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const verifyAndExecute = async (idkitSuccessResult: ISuccessResult) => {
    if (!wallet.connected || !wallet.publicKey) return;
    setIsLoading(true);
    try {
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        1000000000
      );
      await connection.confirmTransaction(signature);

      const provider = new anchor.AnchorProvider(connection, wallet as any, {
        commitment: "processed",
      });

      const program = new Program(
        idl as any,
        provider
      ) as Program<SolanaWorldIdOnchainTemplate>;

      const rootHash = [
        ...Buffer.from(idkitSuccessResult.merkle_root.substring(2), "hex"),
      ];
      const nullifierHash = [
        ...Buffer.from(idkitSuccessResult.nullifier_hash.substring(2), "hex"),
      ];
      const proof = [
        ...Buffer.from(idkitSuccessResult.proof.substring(2), "hex"),
      ];

      const tx = await program.methods
        .verifyAndExecute({
          rootHash: rootHash,
          nullifierHash: nullifierHash,
          proof: proof,
        })
        .accounts({
          payer: provider.wallet.publicKey,
          root: deriveRootKey(WORLD_ID_PROGRAM_ID, Buffer.from(rootHash), 0),
          recipient: wallet.publicKey,
          config: deriveConfigKey(WORLD_ID_PROGRAM_ID),
        })
        .accountsPartial({
          nullifier: anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("nullifier"), Buffer.from(nullifierHash)],
            program.programId
          )[0],
          worldIdProgram: WORLD_ID_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature", tx);
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
