import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, Transaction } from "@solana/web3.js";

export const sendAndConfirmTx = async (
  connection: Connection,
  transaction: Transaction,
  wallet: WalletContextState,
  signatureSet?: Keypair
) => {
  // Get the latest blockhash and set it on the transaction
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  // Set the feePayer to the wallet's public key
  transaction.feePayer = wallet.publicKey!;

  // Sign the transaction with the signatureSet
  if (signatureSet) {
    transaction.partialSign(signatureSet);
  }

  // Sign the transaction with the wallet
  const signedTransaction = await wallet.signTransaction!(transaction);

  // Send and confirm the signed transaction
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  return signature;
};
