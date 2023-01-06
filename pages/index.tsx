import type { NextPage } from "next";
import { useState } from "react";
import BN from "bignumber.js";
import flips from "service/flips";
import { Search, Statistics, SearchList } from "components/Home";

const calcAmount = (value: BN) => {
  return value.div(1e18).toNumber();
};

const Home: NextPage = ({ query }: any) => {
  const [address, setAddress] = useState(query?.address);
  const [dataSource, setDataSource] = useState([]);
  const [statisticsData, setStatisticsData] = useState({
    winFlips: 0,
    loseFlips: 0,
    totalSpend: 0,
    totalProfits: 0,
  });

  const loadData = async (addr: string) => {
    setAddress(addr);
    const data = await flips(addr.toLowerCase());
    setDataSource(data);
    let winFlips = 0;
    let loseFlips = 0;
    let totalSpend = new BN(0);
    let totalRecive = new BN(0);

    // 处理数据
    const datas = data
      .filter((item: any) => item.type === "out")
      .map((item: any) => {
        const inGas = new BN(item.inGasUsed * item.inGasPrice);
        const outGas = new BN(item.outGasUsed * item.outGasPrice);
        const inAmount = new BN(item.inValue).plus(inGas);
        const outAmount = new BN(item.outValue).minus(inGas);
        const flipsAmount = calcAmount(outAmount.minus(inAmount));
        if (flipsAmount > 0) {
          winFlips += 1;
        } else {
          loseFlips += 1;
        }
        totalSpend = totalSpend.plus(outGas).plus(inAmount);
        totalRecive = totalRecive.plus(outAmount);
        return {
          ...item,
          inGas: calcAmount(inGas),
          outGas: calcAmount(outGas),
          inAmount: calcAmount(inAmount),
          outAmount: calcAmount(outAmount),
          flipsAmount: calcAmount(outAmount.minus(inAmount)),
        };
      });

    setStatisticsData({
      winFlips,
      loseFlips,
      totalSpend: calcAmount(totalSpend),
      totalProfits: calcAmount(totalRecive.minus(totalSpend)),
    });
  };

  return (
    <main>
      <div className="container mx-auto py-10">
        <Search value={address} onChange={loadData} />
        <div className="pt-8 pb-6">
          <Statistics address={address} {...statisticsData} />
        </div>
        <SearchList
          list={dataSource.filter((item: any) => item.type === "out").reverse()}
        />
      </div>
    </main>
  );
};

Home.defaultProps = ({ query }: any) => ({
  query,
});

export default Home;
