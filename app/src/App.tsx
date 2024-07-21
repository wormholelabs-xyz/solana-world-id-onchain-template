import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { VerifyAndExecuteButton } from "./components/VerifyAndExecuteButton";
import { Network, getEnv } from "./utils/env";

function App() {
  const [network, setNetwork] = useState<Network>("testnet");
  const { SOLANA_RPC_URL } = useMemo(() => getEnv(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const handleNetworkChange = (event: SelectChangeEvent<Network>) => {
    setNetwork(event.target.value as Network);
  };

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card sx={{ width: 350, overflow: "visible" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Solana World ID
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Connect your wallet and verify
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="network-select-label">Network</InputLabel>
                  <Select
                    labelId="network-select-label"
                    id="network-select"
                    value={network}
                    label="Network"
                    onChange={handleNetworkChange}
                  >
                    <MenuItem value="mainnet" disabled>
                      Mainnet
                    </MenuItem>
                    <MenuItem value="testnet">Testnet</MenuItem>
                    <MenuItem value="localnet">Localnet</MenuItem>
                  </Select>
                </FormControl>
                <WalletMultiButton />
                <VerifyAndExecuteButton network={network} />
              </CardContent>
            </Card>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
