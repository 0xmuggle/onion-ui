import classNames from "classnames";
import moment from "moment";
// import metadata from "multi-metadata";
import { useEffect } from "react";
import { calcAmount } from "service/flips";
const metadata = require("multi-metadata");
console.log('>>> "main": "src/index.js",', metadata);

const diffDuration = (start: string, end: string) => {
  const s = moment.unix(Number(start));
  const e = moment.unix(Number(end));
  const d = e.diff(s, "days");
  const h = e.diff(s, "hours");
  const m = e.diff(s, "m");
  if (d) {
    return `${d} 天`;
  }
  if (h) {
    return `${h} 小时`;
  }
  return `${m} 分钟`;
};

const ListItem = ({ value, gas, type, ...props }: any) => (
  <div>
    <div {...props}>
      <span className="text-base font-bold">{calcAmount(value)}</span>
      <span className="pl-1 text-xs">ETH</span>
    </div>
    {gas && <div className="text-xs text-gray-400">gas: {calcAmount(gas)}</div>}
    <div>{type}</div>  
  </div>
);

const SearchList = ({ list }: any) => {
  const lodaData = async () => {
    console.log('>>> start');
    const result = await metadata.multicall({
      chain: 'eth',
      list: list.slice(0,2).map((item: any) => ({
        contract: item.contract,
        tokenId: item.tokenID,
      }))
    });
    console.log(result);
  }
  useEffect(() => {
    lodaData();
  }, [list])
  return (
    <table className="table w-full shadow-sm">
      <thead>
        <tr>
          <th>NFT</th>
          <th>购入价</th>
          <th>卖出价</th>
          <th>盈利</th>
          <th className="text-right">持有时长</th>
          <th className="text-right">卖出时间</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item: any) => (
          <tr key={item.hash}>
            <td>
              <div className="flex items-center space-x-3">
                <div>

                </div>
                {/* <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={`https://opensea.io/assets/${item.contract}/${item.tokenID}`}
                        alt={item.tokenName}
                      />
                    </div>
                  </div> */}
                <a
                  href={`https://opensea.io/assets/${item.contract}/${item.tokenID}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="font-bold">{item.tokenName}</div>
                  <span className="inline-block max-w-[60px] truncate text-xs opacity-50 hover:text-primary">
                    #{item.tokenID}
                  </span>
                </a>
              </div>
            </td>
            <td>
              <a
                href={`https://etherscan.io/tx/${item.inHash}`}
                target="_blank"
                rel="noreferrer"
              >
                <ListItem
                  value={item.inAmount}
                  type={item.inType}
                  gas={item.inGas}
                />
              </a>
            </td>
            <td>
              <a
                href={`https://etherscan.io/tx/${item.outHash}`}
                target="_blank"
                rel="noreferrer"
              >
                <ListItem
                  value={item.outAmount}
                  gas={item.outGas}
                  type={item.outType}
                />
              </a>
            </td>
            <td>
              <ListItem
                className={classNames({
                  "text-red-500": item.flipsAmount < 0,
                  "text-green-600": item.flipsAmount >= 0,
                })}
                value={item.flipsAmount}
              />
            </td>
            <td className="text-right">
              {diffDuration(item.inTimeStamp, item.outTimeStamp)}
            </td>
            <td className="text-right text-sm">
              {moment.unix(item.outTimeStamp).format("YYYY/MM/DD HH:mm")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchList;
