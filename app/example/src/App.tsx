import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Toaster } from "./components/ui/toaster";

import { VerifyAndExecuteButton } from "./components/VerifyAndExecuteButton";
import { getEnv } from "./utils/env";

function App() {
  const { SOLANA_RPC_URL } = getEnv();
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
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
                <WalletMultiButton />
                <VerifyAndExecuteButton />
              </CardContent>
            </Card>
            <Toaster />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
