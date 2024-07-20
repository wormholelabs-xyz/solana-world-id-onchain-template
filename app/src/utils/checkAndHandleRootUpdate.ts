import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { SolanaWorldIdProgram } from "../../../idls/solana_world_id_program";
import { mockUpdateRoot } from "../../../tests/helpers/solanaWorldIdProgram/mockUpdateRoot";
import { requestAirdrop } from "./requestAirdrop";

// Check if the root account exists, if not, update it if on localnet
// On devnet, the root account is created by the state bridge service that is already running
export async function checkAndHandleRootUpdate(
  connection: Connection,
  network: string,
  publicKey: PublicKey,
  worldIdProgram: Program<SolanaWorldIdProgram>,
  rootHash: number[],
  rootKey: PublicKey,
  tx: Transaction
): Promise<Keypair | undefined> {
  const rootAccountInfo = await connection.getAccountInfo(rootKey);
  if (rootAccountInfo) return;

  if (network !== "localnet") {
    throw new Error("Root account does not exist");
  }

  console.log("Root account does not exist, updating root");
  await requestAirdrop(connection, publicKey);
  return await mockUpdateRoot(worldIdProgram, rootHash, tx);
}
