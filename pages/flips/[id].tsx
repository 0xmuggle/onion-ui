import type { NextPage } from "next";
import { useState } from "react";
import flips, { flipsDtatistics } from "service/flips";
import { Search, Statistics, SearchList } from "components/Home";
import { pick } from "lodash";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const Home: NextPage = ({ query }: any) => {
  const { push } = useRouter();

  const id = query.id.toLowerCase();

  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState({
    address: id,
    name: id,
  });

  const [state, setState] = useState<any>({
    winFlips: 0,
    loseFlips: 0,
    totalSpend: "",
    totalProfits: "",
    dataSources: [],
  });

  const loadData = async (address: string) => {
    try {
      setLoading(true);
      setState({
        winFlips: 0,
        loseFlips: 0,
        totalSpend: "",
        totalProfits: "",
        dataSources: [],
      });
      let addr: any = address;
      if (address.endsWith(".eth")) {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://mainnet.infura.io/v3/5e121bf717404855950bfe9831bfd4b1"
        );
        addr = await provider.resolveName(addr);
      }
      if (!ethers.utils.isAddress(addr)) {
        toast.warn("Address is invalid.");
        setLoading(false);
        return;
      }
      if (id !== addr) {
        push(`/flips/${address}`);
      }
      setAccount({
        address: addr,
        name: address,
      });
      const data = await flips(addr);
      setState(flipsDtatistics(data));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-4">
      <div className="content mx-auto py-10">
        <Search value={account.address} onChange={loadData} />
        <div className="pt-8 pb-6">
          <Statistics
            loading={loading}
            address={account.address}
            name={account.name}
            {...pick(state, [
              "winFlips",
              "loseFlips",
              "totalSpend",
              "totalProfits",
            ])}
          />
        </div>
        <SearchList
          list={(state.dataSources || []).reverse()}
          loading={loading}
        />
      </div>
    </main>
  );
};

Home.getInitialProps = ({ query }: any) => ({
  query,
});

export default Home;
