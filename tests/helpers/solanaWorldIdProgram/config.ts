import * as anchor from "@coral-xyz/anchor";

export function deriveConfigKey(
  worldIdProgramId: anchor.web3.PublicKey
): anchor.web3.PublicKey {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Config")],
    worldIdProgramId
  )[0];
}
