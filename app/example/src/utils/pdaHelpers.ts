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

export function deriveLatestRootKey(
  worldIdProgramId: anchor.web3.PublicKey,
  type: number
): anchor.web3.PublicKey {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("LatestRoot"), Buffer.from([type])],
    worldIdProgramId
  )[0];
}

export function deriveGuardianSetKey(
  wormholeProgramId: anchor.web3.PublicKey,
  index: number
): anchor.web3.PublicKey {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("GuardianSet"),
      (() => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(index);
        return buf;
      })(),
    ],
    wormholeProgramId
  )[0];
}
