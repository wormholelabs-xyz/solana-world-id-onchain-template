export function signaturesToSolanaArray(signatures: string[]) {
  return signatures.map((s) => [
    ...Buffer.from(s.substring(130, 132), "hex"),
    ...Buffer.from(s.substring(0, 130), "hex"),
  ]);
}
