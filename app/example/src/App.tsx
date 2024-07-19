import { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { WalletConnectButton } from "./components/WalletConnectButton";
import { VerifyAndExecuteButton } from "./components/VerifyAndExecuteButton";

function App() {
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
