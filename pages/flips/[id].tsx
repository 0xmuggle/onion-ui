import type { NextPage } from "next";
import { useEffect, useState } from "react";
import flips, { flipsDtatistics } from "service/flips";
import { Search, Statistics, SearchList, Filter } from "components/Home";
import { isEmpty, pick, uniq } from "lodash";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const Home: NextPage = ({ query }: any) => {
  const { push } = useRouter();

  const id = query.id.toLowerCase();

  const [loading, setLoading] = useState(true);

  const [list, setList] = useState([]);

  const [visibleIn, setVisibleIn] = useState(false);

  const [filters, setFilter] = useState([]);

  const [account, setAccount] = useState({
    address: "",
    name: "",
  });

  const [state, setState] = useState<any>({
    winFlips: 0,
    loseFlips: 0,
    totalSpend: "",
    totalProfits: "",
    dataSources: [],
  });

  const caclCollections = (data = list, cs: any = []) => {
    setFilter(cs);
    setState(
      flipsDtatistics(
        data.filter((item: any) => isEmpty(cs) || cs.includes(item.tokenName))
      )
    );
  };

  const doChangeCollections = ({ collections, visible }: any) => {
    caclCollections(
      list,
      collections.map((item: any) => item.value)
    );
    setVisibleIn(visible);
  };

  const loadData = async (address: string) => {
    try {
      setLoading(true);
      setList([]);
      setState({
        winFlips: 0,
        loseFlips: 0,
        totalSpend: "",
        totalProfits: "",
        dataSources: [],
      });
      let addr: any = address;
      if (address.endsWith(".eth")) {
        addr = localStorage.getItem(address);
        if (!addr) {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://rpc.ankr.com/eth"
          );
          addr = await provider.resolveName(address);
          if (addr) {
            localStorage.setItem(address, addr);
          }
        }
      }
      if (!ethers.utils.isAddress(addr)) {
        toast.warn("Address is invalid.");
        setLoading(false);
        return;
      }
      if (id !== address) {
        push(`/flips/${address}`);
      }
      setAccount({
        address: addr,
        name: address,
      });
      const data = await flips(addr);
      setList(data);
      caclCollections(data);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVisibleIn(false);
  }, [id]);

  return (
    <main className="px-4">
      <div className="content mx-auto py-10">
        <Search value={id} onChange={loadData} />
        <Filter
          address={account.address}
          onChange={doChangeCollections}
          collections={uniq(list.map((item: any) => item.tokenName))}
        />
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            <SearchList
              list={(state.dataSources || []).filter(
                (item: any) => visibleIn || item.type !== "in"
              )}
              loading={loading}
            />
          </div>
          <div className="sticky top-[80px] w-[300px]">
            <Statistics
              collections={filters}
              loading={loading}
              address={account.address}
              name={account.name}
              {...pick(state, [
                "cost",
                "transfer",
                "costSpend",
                "winFlips",
                "loseFlips",
                "totalSpend",
                "totalProfits",
              ])}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

Home.getInitialProps = ({ query }: any) => ({
  query,
});

export default Home;
