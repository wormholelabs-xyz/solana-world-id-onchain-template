import { checkAndHandleRootUpdate } from "@/utils/checkAndHandleRootUpdate";
import { Network } from "@/utils/env";
import { getExplorerUrl } from "@/utils/getExplorerUrl";
import { parseIdKitResults } from "@/utils/parseIdKitResults";
import { sendAndConfirmTx } from "@/utils/sendAndConfirmTx";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import React, { useState } from "react";
import { SolanaWorldIdProgram } from "../../../idls/solana_world_id_program";
import worldIdIdl from "../../../idls/solana_world_id_program.json";
import idl from "../../../target/idl/solana_world_id_onchain_template.json";
import { SolanaWorldIdOnchainTemplate } from "../../../target/types/solana_world_id_onchain_template";
import { deriveNullifierKey } from "../../../tests/helpers/nullifier";
import { deriveConfigKey } from "../../../tests/helpers/solanaWorldIdProgram/config";
import { deriveRootKey } from "../../../tests/helpers/solanaWorldIdProgram/root";

export function VerifyAndExecuteButton(props: { network: Network }) {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    signature?: string;
    open: boolean;
    message: string;
    severity: "success" | "error";
    action?: React.ReactNode;
  }>({ open: false, message: "", severity: "success" });

  const provider = new AnchorProvider(connection, anchorWallet as Wallet, {
    commitment: "processed",
  });
  const worldIdProgram = new Program<SolanaWorldIdProgram>(
    worldIdIdl as SolanaWorldIdProgram,
    provider
  );

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const verifyAndExecute = async (idkitSuccessResult: ISuccessResult) => {
    if (!wallet.connected || !wallet.publicKey) return;
    setIsLoading(true);

    try {
      const program = new Program<SolanaWorldIdOnchainTemplate>(
        idl as SolanaWorldIdOnchainTemplate,
        provider
      );

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
      try {
        const signature = await sendAndConfirmTx(
          connection,
          tx,
          wallet,
          updateKeypair
        );

        setSnackbar({
          open: true,
          message: "Verification Successful",
          severity: "success",
          action: (
            <Button
              color="inherit"
              size="small"
              href={getExplorerUrl(props.network, signature)}
              target="_blank"
            >
              View transaction
            </Button>
          ),
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            `Allocate: account Address { address: ${deriveNullifierKey(
              program.programId,
              Buffer.from(nullifierHash)
            ).toString()}, base: None } already in use`
          )
        ) {
          setSnackbar({
            open: true,
            message: "Nullifier already consumed.",
            severity: "error",
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : String(error),
        severity: "error",
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
            fullWidth
            variant="contained"
            sx={{ mt: 2, textTransform: "none" }}
          >
            {isLoading ? "Verifying..." : "Verify and Execute"}
          </Button>
        )}
      </IDKitWidget>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="outlined"
          severity={snackbar.severity}
          action={
            <>
              {snackbar.action}
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
