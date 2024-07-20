import * as anchor from "@coral-xyz/anchor";

export function deriveNullifierKey(
  programId: anchor.web3.PublicKey,
  nullifier_hash: Buffer
): anchor.web3.PublicKey {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("nullifier"), nullifier_hash],
    programId
  )[0];
}
