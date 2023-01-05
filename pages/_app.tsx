import type { AppProps } from "next/app";
import BasicLayout from "components/BasicLayout";
import WagmiApp from "components/WagmiApp";
import "rc-drawer/assets/index.css";
import "styles/globals.css";
import "styles/motion.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiApp>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </WagmiApp>
  );
}

export default MyApp;
