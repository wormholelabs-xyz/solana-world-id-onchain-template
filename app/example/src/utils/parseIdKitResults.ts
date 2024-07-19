import { ISuccessResult } from "@worldcoin/idkit";

export const parseIdKitResults = (results: ISuccessResult) => {
  const rootHash = [...Buffer.from(results.merkle_root.substring(2), "hex")];
  const nullifierHash = [
    ...Buffer.from(results.nullifier_hash.substring(2), "hex"),
  ];
  const proof = [...Buffer.from(results.proof.substring(2), "hex")];

  return {
    rootHash,
    nullifierHash,
    proof,
  };
};
