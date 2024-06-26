import type { NextPage } from "next";
import { useState } from "react";
import flips, { flipsDtatistics } from "service/flips";
import { Search, Statistics, SearchList, Filter } from "components/Home";
import { isEmpty, pick, sortBy, throttle, uniq } from "lodash";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import moment from "moment";

const Home: NextPage = ({ query }: any) => {
  const { push } = useRouter();

  const id = query.id.toLowerCase();

  const [loading, setLoading] = useState(true);

  const [list, setList] = useState([]);

  const [filters, setFilter] = useState([]);

  const [account, setAccount] = useState({
    address: "",
    name: "",
  });

  const [state, setState] = useState<any>({
    winFlips: 0,
    loseFlips: 0,
    approves: 0,
    approvesSpend: "",
    totalSpend: "",
    totalProfits: "",
    dataSources: [],
  });

  const caclCollections = (data = list, cs: any = [], type = "", times = 0) => {
    setFilter(cs);
    let arrs = data.filter((item: any) => {
      const filterCollection = isEmpty(cs) || cs.includes(item.tokenName);
      const filterType =
        !type ||
        item.type === type ||
        (item.type === "approve" && item.type !== "in");
      let filterTime = !times;
      if (times) {
        const hours = moment().diff(
          moment.unix(Number(item.inTimeStamp)),
          "hours"
        );
        const endHours = moment().diff(
          moment.unix(Number(item.outTimeStamp)),
          "hours"
        );
        filterTime = hours <= times || endHours <= times;
      }
      return filterCollection && filterType && filterTime;
    });
    if (type === "out" && times) {
      arrs = sortBy(arrs, "outTimeStamp");
    }
    setState(flipsDtatistics(arrs));
  };

  const doChangeCollections = ({ collections, type, times }: any) => {
    caclCollections(
      list,
      collections.map((item: any) => item.value),
      type?.value,
      times?.value
    );
  };

  const loadData = async (address: string, chain: string) => {
    try {
      setLoading(true);
      setList([]);
      setFilter([]);
      setState({
        winFlips: 0,
        loseFlips: 0,
        totalSpend: "",
        totalProfits: "",
        approveSpend: "",
        approves: 0,
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
      const data: any = await flips(addr.toLocaleLowerCase(), chain);
      setList(data);
      caclCollections(data, [], "", 0);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[100vw] overflow-x-hidden px-4">
      <div className="content mx-auto py-10">
        <Search value={id} onChange={loadData} />
        <Filter
          loading={loading}
          onChange={doChangeCollections}
          collections={uniq(list.map((item: any) => item.tokenName))}
        />
        <div className="flex flex-col-reverse items-start gap-4 lg:flex-row">
          <div className="w-full">
            <SearchList list={state.dataSources} loading={loading} />
          </div>
          <div className="top-[80px] w-full min-w-[320px] md:sticky lg:w-[320px]">
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
                "approveSpend",
                "approves",
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
