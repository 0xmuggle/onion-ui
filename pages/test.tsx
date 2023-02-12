import type { NextPage } from "next";
import { useRouter } from "next/router";

import collections from "common/collections.json";
import { useEffect, useState } from "react";
import { Avatar, Table } from "components/Common";
import { isEmpty } from "lodash";

const Home: NextPage = () => {
  const [data, setData] = useState<any>([]);
  const { push } = useRouter();

  const loadData = () => {
    const d = collections.filter((item: any) => {
      return (
        !isEmpty(item.bestCollectionBid) &&
        item.floorPrice?.amount < 0.3 &&
        item.totalCollectionBidValue?.amount >= 10 &&
        item.volumeOneWeek?.amount > 20 &&
        item.volumeOneDay?.amount !== item.volumeOneWeek?.amount &&
        item.volumeOneDay?.amount / (item.floorPriceOneDay?.amount || 1) > 20
      );
    });
    setData(d);
  };
  useEffect(() => {
    loadData();
  }, []);
  const colums = [
    {
      key: "name",
      label: "Name",
      render: (name: string, { imageUrl, collectionSlug }: any) => {
        return (
          <a
            href={`https://blur.io/collection/${collectionSlug}/bids`}
            target="_blank"
            className="flex items-center gap-2"
            rel="noreferrer"
          >
            <img width={40} src={imageUrl} className="rounded" />
            <div>{name}</div>
          </a>
        );
      },
    },
    {
      key: "bestCollectionBid",
      label: "foor price",
      render: (_: any, { floorPrice }: any) => floorPrice?.amount,
    },
    {
      key: "bestCollectionBid",
      label: "topBid",
      render: (_: any, { bestCollectionBid }: any) =>
        Number(bestCollectionBid?.amount).toFixed(2),
    },
    {
      key: "volumeOneDay",
      label: "交易次数",
      render: (_: any, { volumeOneDay, floorPriceOneDay }: any) =>
        Number(volumeOneDay?.amount / (floorPriceOneDay?.amount || 1)).toFixed(
          0
        ),
    },
    {
      key: "volumeOneDay",
      label: "Day",
      render: (_: any, { volumeOneDay }: any) =>
        Number(volumeOneDay?.amount).toFixed(2),
    },
    {
      key: "volumeOneWeek",
      label: "Week",
      render: (_: any, { volumeOneWeek }: any) =>
        Number(volumeOneWeek?.amount).toFixed(2),
    },
  ];
  return (
    <main className="px-4">
      <div className="mx-auto max-w-[1200px] py-10">
        <div>Total{data.length}</div>
        <Table
          pageSize={data.length}
          loading={false}
          page={1}
          total={data.length}
          colums={colums}
          dataSource={data}
        />
      </div>
    </main>
  );
};

export default Home;
