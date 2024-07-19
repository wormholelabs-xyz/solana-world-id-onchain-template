const SOLANA_RPC_URL_MAP = {
  localnet: "http://127.0.0.1:8899",
  testnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

export function getEnv() {
  const NETWORK: "localnet" | "testnet" | "mainnet" = import.meta.env
    .VITE_NETWORK;

  const SOLANA_RPC_URL = SOLANA_RPC_URL_MAP[NETWORK];
  return { NETWORK, SOLANA_RPC_URL };
}
