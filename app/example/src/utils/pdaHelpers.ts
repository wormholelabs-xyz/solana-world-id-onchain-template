import * as anchor from "@coral-xyz/anchor";

export const deriveRootKey = (
  worldIdProgramId: anchor.web3.PublicKey,
  root: Buffer,
  type: number
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Root"), root, Buffer.from([type])],
    worldIdProgramId
  )[0];
};

export const deriveConfigKey = (worldIdProgramId: anchor.web3.PublicKey) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Config")],
    worldIdProgramId
  )[0];
};
