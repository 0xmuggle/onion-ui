import type { AppProps } from "next/app";
import BasicLayout from "components/BasicLayout";
import { ToastContainer } from "react-toastify";
import "styles/globals.css";
import "styles/motion.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}

export default MyApp;
