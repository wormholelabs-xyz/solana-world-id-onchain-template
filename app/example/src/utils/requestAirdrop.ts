import { Connection, PublicKey } from "@solana/web3.js";

export const requestAirdrop = async (connection: Connection, publicKey: PublicKey) => {
  const airdropSignature = await connection.requestAirdrop(publicKey, 1000000000);
  await connection.confirmTransaction(airdropSignature);
};
