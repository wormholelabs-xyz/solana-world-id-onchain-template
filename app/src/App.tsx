import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { VerifyAndExecuteButton } from "./components/VerifyAndExecuteButton";
import { Network, getEnv } from "./utils/env";

function App() {
  const [network, setNetwork] = useState<Network>("devnet");
  const { SOLANA_RPC_URL } = useMemo(() => getEnv(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const handleNetworkChange = (event: SelectChangeEvent<Network>) => {
    setNetwork(event.target.value as Network);
  };

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <CssBaseline />
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: grey[100],
            }}
          >
            <Card sx={{ width: 350, overflow: "visible" }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  Solana World ID
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Connect your wallet and verify
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
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
                    <MenuItem value="devnet">Devnet</MenuItem>
                    <MenuItem value="localnet">Localnet</MenuItem>
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    "& .wallet-adapter-dropdown": { width: "100%" },
                    "& .wallet-adapter-button": {
                      width: "100%",
                      justifyContent: "center",
                    },
                    "& .wallet-adapter-dropdown-list-active": {
                      transform: "translate(-50%, 10px)",
                    },
                  }}
                >
                  <WalletMultiButton />
                </Box>
                <VerifyAndExecuteButton network={network} />
              </CardContent>
            </Card>
          </Box>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
