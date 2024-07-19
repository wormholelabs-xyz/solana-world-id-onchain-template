const SOLANA_RPC_URL_MAP = {
  localnet: "http://127.0.0.1:8899",
  testnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

export type Network = keyof typeof SOLANA_RPC_URL_MAP;

export function getEnv(network: Network) {
  const SOLANA_RPC_URL = SOLANA_RPC_URL_MAP[network];
  return { SOLANA_RPC_URL };
}
