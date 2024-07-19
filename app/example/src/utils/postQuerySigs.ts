import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { SolanaWorldIdProgram } from "../target/types/solana_world_id_program";
import { signaturesToSolanaArray } from "./signaturesToSolanaArray";

export async function postQuerySigs(
  querySignatures: string[],
  signatureKeypair: anchor.web3.Keypair,
  totalSignatures: number = 0,
  p: Program<SolanaWorldIdProgram>
) {
  const signatureData = signaturesToSolanaArray(querySignatures);
  return await p.methods
    .postSignatures(signatureData, totalSignatures || signatureData.length)
    .accounts({ guardianSignatures: signatureKeypair.publicKey })
    .signers([signatureKeypair])
    .instruction();
}
