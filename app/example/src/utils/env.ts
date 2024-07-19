import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaWorldIdProgram } from "../example/src/target/types/solana_world_id_program";
import idl from "../example/src/target/idl/solana_world_id_program.json";

export function getEnv() {
  const PAYER_PRIVATE_KEY = Buffer.from(
    require(process.env.WALLET ||
      "../../tests/keys/pFCBP4bhqdSsrWUVTgqhPsLrfEdChBK17vgFM7TxjxQ.json")
  );
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(PAYER_PRIVATE_KEY)
  );
  console.log("Wallet:          ", wallet.publicKey.toString());
  const connection = new anchor.web3.Connection(
    "http://localhost:8899",
    "confirmed"
  );
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  const program = new Program(
    idl as any,
    provider
  ) as Program<SolanaWorldIdProgram>;

  return { program, provider, wallet };
}
