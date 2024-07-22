export function getExplorerUrl(network: string, signature: string) {
  const baseUrl = "https://explorer.solana.com/tx";
  switch (network) {
    case "localnet":
      return `${baseUrl}/${signature}?cluster=custom&customUrl=http://localhost:8899`;
    case "devnet":
      return `${baseUrl}/${signature}?cluster=devnet`;
    default:
      return `${baseUrl}/${signature}`;
  }
}
