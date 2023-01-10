import classNames from "classnames";
import { Table } from "components/Common";
import moment from "moment";
import { useEffect, useState } from "react";
import { calcAmount } from "service/flips";

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
      <span className="font-bold">{calcAmount(value)}</span>
      <span className="pl-1 text-xs">ETH</span>
    </div>
    {gas && <div className="text-xs text-gray-400">gas: {calcAmount(gas)}</div>}
    {/* <div>{type}</div>   */}
  </div>
);

const SearchList = ({ list, loading }: any) => {
  const [page, setPage] = useState(1);
  const onChangePage = (current: number) => {
    setPage(current);
  };
  const pageSize = 10;
  const colums = [
    {
      key: "tokenID",
      label: "NFT",
      render: (_: any, item: any) => {
        return (
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
        );
      },
    },
    {
      key: "inHash",
      label: "购入价",
      render: (_: any, item: any) => {
        return (
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
        );
      },
    },
    {
      key: "outHash",
      label: "卖出价",
      render: (_: any, item: any) => {
        return (
          <a
            href={`https://etherscan.io/tx/${item.outHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <ListItem
              value={item.outAmount}
              type={item.outType}
              gas={item.outGas}
            />
          </a>
        );
      },
    },
    {
      key: "flipsAmount",
      label: "盈利",
      render: (flipsAmount: any) => {
        return (
          <ListItem
            className={classNames({
              "text-red-500": flipsAmount < 0,
              "text-green-600": flipsAmount >= 0,
            })}
            value={flipsAmount}
          />
        );
      },
    },
    {
      key: "inTimeStamp",
      label: "持有时长",
      render: (_: any, item: any) =>
        diffDuration(item.inTimeStamp, item.outTimeStamp),
      labelProps: {
        className: "text-right text-sm",
      },
    },
    {
      key: "outTimeStamp",
      label: "卖出时间",
      render: (outTimeStamp: any) =>
        moment.unix(outTimeStamp).format("YYYY/MM/DD HH:mm"),
      labelProps: {
        className: "text-right text-sm",
      },
    },
  ];
  return (
    <Table
      loading={loading}
      colums={colums}
      dataSource={list.slice((page - 1) * pageSize, page * pageSize)}
      page={page}
      pageSize={pageSize}
      onChangePage={onChangePage}
      total={list.length}
    />
  );
};

export default SearchList;
