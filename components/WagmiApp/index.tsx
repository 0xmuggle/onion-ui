import {
  configureChains,
  createClient,
  WagmiConfig,
  // defaultChains,
  chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, provider, webSocketProvider } = configureChains(
  // 指定链
  [chain.goerli], // 默认链 defaultChains,
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function WagmiApp({ children }: any) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}

export default WagmiApp;
