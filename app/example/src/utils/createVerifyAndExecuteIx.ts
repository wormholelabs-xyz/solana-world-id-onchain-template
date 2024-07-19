import { SolanaWorldIdOnchainTemplate } from "@/target/types/solana_world_id_onchain_template";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { WORLD_ID_PROGRAM_ID } from "./constants";

export async function createVerifyAndExecuteInstruction(
  p: Program<SolanaWorldIdOnchainTemplate>,
  rootHash: number[],
  nullifierHash: number[],
  proof: number[],
  payer: PublicKey,
  root: PublicKey,
  recipient: PublicKey,
  config: PublicKey,
  nullifier: PublicKey,
  systemProgram: PublicKey
) {
  return await p.methods
    .verifyAndExecute({
      rootHash,
      nullifierHash: nullifierHash,
      proof: proof,
    })
    .accounts({
      payer,
      root,
      recipient,
      config,
    })
    .accountsPartial({
      nullifier,
      worldIdProgram: WORLD_ID_PROGRAM_ID,
      systemProgram: systemProgram,
    })
    .instruction();
}
