import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Toaster } from "./components/ui/toaster";

import { VerifyAndExecuteButton } from "./components/VerifyAndExecuteButton";
import { Network, getEnv } from "./utils/env";

function App() {
  const [network, setNetwork] = useState<Network>("testnet");
  const { SOLANA_RPC_URL } = useMemo(() => getEnv(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Solana World ID</CardTitle>
                <CardDescription>~
                  Connect your wallet and verify
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  onValueChange={(value) => setNetwork(value as Network)}
                  defaultValue={network}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mainnet" disabled={true}>
                      Mainnet
                    </SelectItem>
                    <SelectItem value="testnet">Testnet</SelectItem>
                    <SelectItem value="localnet">Localnet</SelectItem>
                  </SelectContent>
                </Select>
                <WalletMultiButton />
                <VerifyAndExecuteButton network={network} />
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
