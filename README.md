# Solana World ID On-Chain Template

Template repository for a World ID On-Chain Integration on Solana.

Like [world-id-onchain-template](https://github.com/worldcoin/world-id-onchain-template/), but make it Solana.

## Local Development

### Prerequisites

Create a staging on-chain app in the [Worldcoin Developer Portal](https://developer.worldcoin.org).

Ensure you have installed [Anchor](https://www.anchor-lang.com/docs/installation).

### Local Testnet Setup

Set your app ID and action ID from the developer portal in [verify_and_execute.rs](./programs/solana-world-id-onchain-template/src/instructions/verify_and_execute.rs) and [VerifyAndExecuteButton.tsx](app/example/src/components/VerifyAndExecuteButton.tsx).

Build your program with `anchor build`.

Get the newly generated program ID with `solana address -k target/deploy/solana_world_id_onchain_template-keypair.json`.

Update the `declare_id!` macro in [lib.rs](./programs/solana-world-id-onchain-template/src/lib.rs) and the `solana_world_id_onchain_template` address in [Anchor.toml](./Anchor.toml) with the above key.

Start localnet with `anchor localnet`.

### Local Web Setup

In a new shell, install project dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start -w app
```

### Iterating

After making changes to the contract, you should:

- close and restart `anchor localnet`

### Testing

When using localnet, the UI will airdrop funds to the connected wallet on the first transaction. You can also airdrop funds manually via the CLI with `solana airdrop -u l <AMOUNT> [RECIPIENT_ADDRESS]`.

Use the [Worldcoin Simulator](https://simulator.worldcoin.org) in place of World App to scan the IDKit QR codes and generate the zero-knowledge proofs.
