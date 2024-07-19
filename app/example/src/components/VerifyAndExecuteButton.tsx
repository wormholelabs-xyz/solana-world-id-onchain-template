import { SolanaWorldIdProgram } from "@/target/types/solana_world_id_program";
import { checkAndHandleRootUpdate } from "@/utils/checkAndHandleRootUpdate";
import { createVerifyAndExecuteInstruction } from "@/utils/createVerifyAndExecuteIx";
import { getEnv } from "@/utils/env";
import { getExplorerUrl } from "@/utils/getExplorerUrl";
import { parseIdKitResults } from "@/utils/parseIdKitResults";
import {
	deriveConfigKey,
	deriveGuardianSetKey,
	deriveLatestRootKey,
	deriveRootKey,
} from "@/utils/pdaHelpers";
import { queryMock } from "@/utils/queryMock";
import { sendAndConfirmTx } from "@/utils/sendAndConfirmTx";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	Keypair,
	PublicKey,
	SystemProgram,
	Transaction
} from "@solana/web3.js";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import idl from "../../../../target/idl/solana_world_id_onchain_template.json";
import worldIdIdl from "../target/idl/solana_world_id_program.json";
import { SolanaWorldIdOnchainTemplate } from "../target/types/solana_world_id_onchain_template";
import { Button } from "./ui/button";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";

const DEVNET_CORE_BRIDGE_ADDRESS = new PublicKey(
  "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
);

export function VerifyAndExecuteButton() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const provider = new AnchorProvider(connection, wallet as any, {
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
      const { NETWORK } = getEnv();
      const program = new Program(
        idl as any,
        provider
      ) as Program<SolanaWorldIdOnchainTemplate>;
      const { rootHash, nullifierHash, proof } =
        parseIdKitResults(idkitSuccessResult);
      const { bytes, signatures } = await queryMock(
        worldIdProgram,
        Buffer.from(rootHash).toString("hex")
      );

      const signatureSet = Keypair.generate();
      const guardianSet = deriveGuardianSetKey(DEVNET_CORE_BRIDGE_ADDRESS, 0);
      const rootKey = deriveRootKey(
        worldIdProgram.programId,
        Buffer.from(rootHash),
        0
      );
      const latestRootKey = deriveLatestRootKey(worldIdProgram.programId, 0);
      const config = deriveConfigKey(worldIdProgram.programId);

      const tx = new Transaction();
      const needUpdateRoot = await checkAndHandleRootUpdate(
        connection,
        NETWORK,
        wallet.publicKey,
        worldIdProgram,
        bytes,
        signatures,
        rootHash,
        guardianSet,
        signatureSet,
        rootKey,
        latestRootKey,
        config,
        tx
      );

      const verifyAndExecuteInstruction =
        await createVerifyAndExecuteInstruction(
          program,
          rootHash,
          nullifierHash,
          proof,
          provider.wallet.publicKey,
          rootKey,
          wallet.publicKey,
          config,
          PublicKey.findProgramAddressSync(
            [Buffer.from("nullifier"), Buffer.from(nullifierHash)],
            program.programId
          )[0],
          SystemProgram.programId
        );

      tx.add(verifyAndExecuteInstruction);
      const signature = await sendAndConfirmTx(
        connection,
        tx,
        wallet,
        needUpdateRoot ? signatureSet : undefined
      );

      toast({
        title: "Verification Successful",
        action: (
          <ToastAction
            altText="View transaction"
            onClick={() =>
              window.open(getExplorerUrl(NETWORK, signature), "_blank")
            }
          >
            View transaction
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IDKitWidget
        app_id="app_staging_7d23b838b02776cebd87b86ac3248641"
        action="testing"
        signal={`0x${new PublicKey(
          "5yNbCZcCHeAxdmMJXcpFgmurEnygaVbCRwZNMMWETdeZ"
        )
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
    </>
  );
}

