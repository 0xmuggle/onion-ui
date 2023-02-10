import { useEffect, useState } from "react";
import Select from "react-select";

const times: any = [
  {
    label: "24小时内",
    value: 24,
  },
  {
    label: "3天内",
    value: 3 * 24,
  },
  {
    label: "7天内",
    value: 7 * 24,
  },
  {
    label: "一个月内",
    value: 30 * 7 * 24,
  },
];

const soldTypes = [
  {
    label: "已售出",
    value: "out",
  },
  {
    label: "未售出",
    value: "in",
  },
] as any;

const Filter = ({ collections = [], onChange, loading }: any) => {
  const [filter, setFilter] = useState({
    collections: [],
    type: "",
    times: "",
  });
  const doChange = (key: string) => (val: any) => {
    const nextFilter = {
      ...filter,
      [key]: val,
    };
    setFilter(nextFilter);
    onChange?.(nextFilter);
  };

  useEffect(() => {
    if (loading) {
      setFilter({
        collections: [],
        type: "",
        times: "",
      });
    }
  }, [loading]);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 pb-4 text-sm">
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:w-auto">
        <span>合集</span>
        <Select
          isMulti
          className="z-10 min-w-[220px] flex-1"
          placeholder="请选择NFT合集"
          options={collections.map((item: any) => ({
            label: item,
            value: item,
          }))}
          onChange={doChange("collections")}
          value={filter.collections}
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:w-auto">
        <span>状态</span>
        <Select
          isClearable
          className="z-2 min-w-[180px] flex-1"
          placeholder="状态"
          options={soldTypes}
          onChange={doChange("type")}
          value={filter.type}
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:w-auto">
        <span>时间</span>
        <Select
          isClearable
          className="z-1 min-w-[180px] flex-1"
          placeholder="请选择时间"
          options={times}
          onChange={doChange("times")}
          value={filter.times}
        />
      </div>
    </div>
  );
};

export default Filter;
