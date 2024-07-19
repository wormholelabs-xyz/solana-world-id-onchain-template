import { SolanaWorldIdProgram } from "@/target/types/solana_world_id_program";
import { Program } from "@coral-xyz/anchor";
import { deriveGuardianSetKey } from "./pdaHelpers";
import { QueryProxyQueryResponse } from "@wormhole-foundation/wormhole-query-sdk";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export async function updateRootWithQuery(
  p: Program<SolanaWorldIdProgram>,
  queryResponse: QueryProxyQueryResponse,
  rootHash: string,
  coreBridgeAddress: PublicKey,
  guardianSetIndex: number = 0
) {
  return p.methods
    .updateRootWithQuery(
      Buffer.from(queryResponse.bytes, "hex"),
      [...Buffer.from(rootHash, "hex")],
      guardianSetIndex
    )
    .accountsPartial({
      guardianSet: deriveGuardianSetKey(coreBridgeAddress, guardianSetIndex),
      guardianSignatures: anchor.web3.Keypair.generate().publicKey,
    })
    .rpc();
}
