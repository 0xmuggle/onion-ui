import type { NextPage } from "next";
import { Search } from "components/Home";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const sendMessage = () => {
    var iframe: any = document.getElementById("test");
    const iWindow = iframe.contentWindow || iframe;
    const iDoc = iframe.contentDocument || iWindow.document;
    const script = iDoc.createElement("script");
    var injected_script = 'console.log("window.id ==", window.id)';
    script.append(injected_script);
    iDoc.documentElement.appendChild(script);
  };
  return (
    <main className="px-4">
      <iframe
        allow=""
        id="test"
        src="https://blur.io"
        width="100%"
        height="500px"
        onLoad={sendMessage}
      ></iframe>
    </main>
  );
};

export default Home;
