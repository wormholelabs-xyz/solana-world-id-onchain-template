import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { SolanaWorldIdProgram } from "@/target/types/solana_world_id_program";
import { requestAirdrop } from "./requestAirdrop";
import { postQuerySigs } from "./postQuerySigs";
import { createUpdateRootInstruction } from "./updateRootWithQueryInstruction";

// Check if the root account exists, if not, update it if on localnet
// On devnet, the root account is created by the state bridge service that is already running
export async function checkAndHandleRootUpdate(
  connection: Connection,
  network: string,
  publicKey: PublicKey,
  worldIdProgram: Program<SolanaWorldIdProgram>,
  bytes: Uint8Array,
  sigs: string[],
  rootHash: number[],
  guardianSet: PublicKey,
  signatureSet: Keypair,
  rootKey: PublicKey,
  latestRootKey: PublicKey,
  config: PublicKey,
  tx: Transaction
): Promise<boolean> {
  const rootAccountInfo = await connection.getAccountInfo(rootKey);
  if (rootAccountInfo) return false;

  if (network !== "localnet") {
    throw new Error("Root account does not exist");
  }

  console.log("Root account does not exist, updating root");
  await requestAirdrop(connection, publicKey);

  const postQuerySigsInstruction = await postQuerySigs(
    sigs,
    signatureSet,
    0,
    worldIdProgram
  );
  const updateRootInstruction = await createUpdateRootInstruction(
    worldIdProgram,
    Buffer.from(bytes),
    rootHash,
    guardianSet,
    signatureSet.publicKey,
    rootKey,
    latestRootKey,
    config,
    publicKey
  );

  tx.add(postQuerySigsInstruction, updateRootInstruction);
  return true;
}
