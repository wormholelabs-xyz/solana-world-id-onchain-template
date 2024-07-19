# Running the UI Example for Verify and Execute

1. Dump the `solana-world-id-program` from `devnet`

```bash
 solana program dump 9QwAWx3TKg4CaTjHNhBefQeNSzEKDe2JDxL46F76tVDv solana-world-id-program.so --url https://api.devnet.solana.com
```

2. Start a local validator with the dumped program

```bash
solana-test-validator --bpf-program 9QwAWx3TKg4CaTjHNhBefQeNSzEKDe2JDxL46F76tVDv solana-world-id-program.so --reset
```

3. You need SOL in the test wallet to deploy `solana-world-id-onchain-program`

```bash
solana airdrop 2 pFCBP4bhqdSsrWUVTgqhPsLrfEdChBK17vgFM7TxjxQ --url http://127.0.0.1:8899
```

3. Deploy `solana-world-id-onchain-template-program`

```bash
anchor deploy
```

4. Run the frontend client using `npm run dev`
