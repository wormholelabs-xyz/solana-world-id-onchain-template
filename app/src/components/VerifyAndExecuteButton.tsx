import { checkAndHandleRootUpdate } from "@/utils/checkAndHandleRootUpdate";
import { Network } from "@/utils/env";
import { getExplorerUrl } from "@/utils/getExplorerUrl";
import { parseIdKitResults } from "@/utils/parseIdKitResults";
import { sendAndConfirmTx } from "@/utils/sendAndConfirmTx";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import { SolanaWorldIdProgram } from "../../../idls/solana_world_id_program";
import worldIdIdl from "../../../idls/solana_world_id_program.json";
import idl from "../../../target/idl/solana_world_id_onchain_template.json";
import { SolanaWorldIdOnchainTemplate } from "../../../target/types/solana_world_id_onchain_template";
import { deriveConfigKey } from "../../../tests/helpers/solanaWorldIdProgram/config";
import { deriveRootKey } from "../../../tests/helpers/solanaWorldIdProgram/root";
import { Button } from "./ui/button";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";

export function VerifyAndExecuteButton(props: { network: Network }) {
  const wallet = useWallet();

  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const provider = new AnchorProvider(connection, wallet as Wallet, {
    commitment: "processed",
  });
  const worldIdProgram = new Program<SolanaWorldIdProgram>(
    worldIdIdl,
    provider
  );

  const verifyAndExecute = async (idkitSuccessResult: ISuccessResult) => {
    if (!wallet.connected || !wallet.publicKey) return;
    setIsLoading(true);

    try {
      const program = new Program<SolanaWorldIdOnchainTemplate>(idl, provider);

      const { rootHash, nullifierHash, proof } =
        parseIdKitResults(idkitSuccessResult);

      const rootKey = deriveRootKey(
        worldIdProgram.programId,
        Buffer.from(rootHash),
        0
      );
      const config = deriveConfigKey(worldIdProgram.programId);

      const tx = new Transaction();
      const updateKeypair = await checkAndHandleRootUpdate(
        connection,
        props.network,
        wallet.publicKey,
        worldIdProgram,
        rootHash,
        rootKey,
        tx
      );

      const verifyAndExecuteInstruction = await program.methods
        .verifyAndExecute({
          rootHash,
          nullifierHash,
          proof,
        })
        .accounts({
          root: rootKey,
          recipient: wallet.publicKey,
          config,
        })
        .instruction();

      tx.add(verifyAndExecuteInstruction);
      const signature = await sendAndConfirmTx(
        connection,
        tx,
        wallet,
        updateKeypair
      );

      toast({
        title: "Verification Successful",
        action: (
          <ToastAction
            altText="View transaction"
            onClick={() =>
              window.open(getExplorerUrl(props.network, signature), "_blank")
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
        signal={`0x${wallet.publicKey?.toBuffer().toString("hex")}`}
        onSuccess={verifyAndExecute}
        autoClose
      >
        {({ open }) => (
          <Button
            onClick={open}
            disabled={!wallet.connected || !wallet.publicKey || isLoading}
            className="w-full mt-4"
          >
            {isLoading ? "Verifying..." : "Verify and Execute"}
          </Button>
        )}
      </IDKitWidget>
    </>
  );
}
