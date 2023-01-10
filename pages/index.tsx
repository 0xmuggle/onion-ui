import type { NextPage } from "next";
import { zeroAddress } from "service/flips";
import { Search, Statistics } from "components/Home";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { push } = useRouter();

  const loadData = async (address: string) => {
    push(`/flips/${address}`);
  };

  return (
    <main className="px-4">
      <div className="content mx-auto py-10">
        <Search value={""} onChange={loadData} />
        <div className="pt-8 pb-6">
          <Statistics
            loading
            address={zeroAddress}
            name={zeroAddress}
            winFlips={0}
            loseFlips={0}
            totalSpend={0}
            totalProfits={0}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
