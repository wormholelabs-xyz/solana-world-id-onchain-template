import { SolanaWorldIdProgram } from "@/target/types/solana_world_id_program";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export async function createUpdateRootInstruction(
	worldIdProgram: Program<SolanaWorldIdProgram>,
	futureResponseBytes: Buffer,
	rootHash: number[],
	guardianSet: PublicKey,
	guardianSignatures: PublicKey,
	rootKey: PublicKey,
	latestRootKey: PublicKey,
	config: PublicKey,
	refundRecipient: PublicKey
  ) {
	return await worldIdProgram.methods
	  .updateRootWithQuery(futureResponseBytes, rootHash, 0)
	  .accountsPartial({
		guardianSet: guardianSet,
		guardianSignatures: guardianSignatures,
		root: rootKey,
		latestRoot: latestRootKey,
		config: config,
		refundRecipient: refundRecipient,
		systemProgram: SystemProgram.programId,
	  })
	  .instruction();
  }

