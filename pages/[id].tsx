import type { NextPage } from "next";
import { useState } from "react";
import flips, { flipsDtatistics } from "service/flips";
import { Search, Statistics, SearchList } from "components/Home";
import { pick } from "lodash";
import { toast } from "react-toastify";

const Home: NextPage = ({ query }: any) => {
  const [account, setAccount] = useState({
    address: query.id,
    name: query.id,
  });
  const [state, setState] = useState<any>({
    winFlips: 0,
    loseFlips: 0,
    totalSpend: "",
    totalProfits: "",
    dataSources: [],
  });

  const loadData = async (address: string, name: string) => {
    try {
      const addr = address.toLowerCase();
      setAccount({
        address: addr,
        name,
      });
      const data = await flips(addr);
      setState(flipsDtatistics(data));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <main>
      <div className="container mx-auto py-10">
        <Search value={account.address} onChange={loadData} />
        <div className="pt-8 pb-6">
          <Statistics
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
          list={(state.dataSources || [])
            // .filter((item: any) => item.type === "out")
            // .filter((item: any) => item.tokenName === "Gangster All Star: Evolution")
            .reverse()
          }
        />
      </div>
    </main>
  );
};

Home.getInitialProps = ({ query }: any) => ({
  query,
});

export default Home;
