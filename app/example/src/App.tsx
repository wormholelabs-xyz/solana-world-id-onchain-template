import React, { useState, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaWorldIdOnchainTemplate } from "./target/types/solana_world_id_onchain_template";
import idl from "../../../target/idl/solana_world_id_onchain_template.json";

import "@solana/wallet-adapter-react-ui/styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";

const PROGRAM_ID = new PublicKey(
  "E8byx9xyWhup2oT2PDR6w2KXHY2Fg2DFNAjj7Svx9spa"
);
const WORLD_ID_PROGRAM_ID = new PublicKey(
  "9QwAWx3TKg4CaTjHNhBefQeNSzEKDe2JDxL46F76tVDv"
);

function WalletConnectButton() {
  return <WalletMultiButton className="w-full" />;
}

function VerifyAndExecuteButton() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const deriveRootKey = (
    worldIdProgramId: anchor.web3.PublicKey,
    root: Buffer,
    type: number
  ) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Root"), root, Buffer.from([type])],
      worldIdProgramId
    )[0];
  };

  const deriveConfigKey = (worldIdProgramId: anchor.web3.PublicKey) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Config")],
      worldIdProgramId
    )[0];
  };

  const verifyAndExecute = async () => {
    if (!wallet.connected || !wallet.publicKey) return;
    const signature = await connection.requestAirdrop(
      wallet.publicKey,
      1000000000
    );
    await connection.confirmTransaction(signature);
    setIsLoading(true);
    try {
      console.log("Creating provider...");
      const provider = new anchor.AnchorProvider(connection, wallet as any, {
        commitment: "processed",
      });

      console.log("Creating program instance...");
      const program = new Program(
        idl as any,
        provider
      ) as Program<SolanaWorldIdOnchainTemplate>;

      console.log("Preparing transaction...");
      const idkitSuccessResult = {
        proof:
          "0x177606b1626d9de53cca760de8907c122dcd7a0a8e36d6714785643b11604a61290b36c88275913ac7a0493e43362eff9e75cfc407e8fb3baab5b70323f29dbe0aa915653679af4671b1abbe0d79d2f08ee30696b336b81321f6d21ef0817c641177998bcd88a114cec8fe64783ba28f3fb1cc7b82e6438a414596ec1d2a606010a45353ded3a594f599b6d4abbde58d6f64e2a1d705cdaa6850400eb58312392d56bba2718764fc9062b92159314937a9683f491e0e77253cd3a1000ce601632383b56798f90d32756497d00aab3ed4520ab743e1718fcd0707435e1cf24bfd23eb1717e04b27c3b9c98d098ab8f876f5a6fa72d2dccc6850f7c98d80d7549a",
        merkle_root:
          "0x29e7081a4cb49cd0119c81d766d9ca41cbdfaf3ce21c8ae0963b8d1b15db4d9a",
        nullifier_hash:
          "0x2aa975196dc1f4f9f57b8195bea9c61331e0012ec25484ed569782c49145721a",
        verification_level: "orb",
      };

      const rootHash = [
        ...Buffer.from(idkitSuccessResult.merkle_root.substring(2), "hex"),
      ];
      const nullifierHash = [
        ...Buffer.from(idkitSuccessResult.nullifier_hash.substring(2), "hex"),
      ];
      const proof = [
        ...Buffer.from(idkitSuccessResult.proof.substring(2), "hex"),
      ];

      console.log("Building transaction...");
      const tx = await program.methods
        .verifyAndExecute({
          rootHash: rootHash,
          nullifierHash: nullifierHash,
          proof: proof,
        })
        .accounts({
          payer: provider.wallet.publicKey,
          root: deriveRootKey(WORLD_ID_PROGRAM_ID, Buffer.from(rootHash), 0),
          recipient: wallet.publicKey,
          config: deriveConfigKey(WORLD_ID_PROGRAM_ID),
        })
        .accountsPartial({
          nullifier: anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("nullifier"), Buffer.from(nullifierHash)],
            program.programId
          )[0],
          worldIdProgram: WORLD_ID_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // console.log("Getting latest blockhash...");
      // const {
      //   context: { slot: minContextSlot },
      //   value: { blockhash, lastValidBlockHeight },
      // } = await connection.getLatestBlockhashAndContext();

      // const transaction = new Transaction().add(tx);
      // transaction.recentBlockhash = blockhash;
      // transaction.feePayer = wallet.publicKey;

      // console.log("Sending transaction...");
      // const signature = await wallet.sendTransaction(transaction, connection, {
      //   minContextSlot,
      // });
      console.log("Transaction signature", tx);
      alert("Verification successful!");
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      alert(
        "Verification failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={verifyAndExecute}
      disabled={!wallet.connected || isLoading}
      className="w-full mt-4"
    >
      {isLoading ? "Verifying..." : "Verify and Execute"}
    </Button>
  );
}

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = "http://localhost:8899";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Solana World ID</CardTitle>
                <CardDescription>
                  Connect your wallet and verify
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnectButton />
                <VerifyAndExecuteButton />
              </CardContent>
            </Card>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
