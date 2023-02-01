import { useEffect, useState } from "react";
import Select from "react-select";

const Filter = ({ collections = [], onChange, address }: any) => {
  const [filter, setFilter] = useState({
    collections: [],
    type: "",
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
    setFilter({
      collections: [],
      type: "",
    });
  }, [address]);
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 pb-4 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>合集</span>
        <Select
          isMulti
          className="z-20 min-w-[300px]"
          placeholder="请选择NFT合集"
          options={collections.map((item: any) => ({
            label: item,
            value: item,
          }))}
          onChange={doChange("collections")}
          value={filter.collections}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>状态</span>
        <Select
          isClearable
          className="z-20 min-w-[300px]"
          placeholder="状态"
          options={
            [
              {
                label: "已售出",
                value: "out",
              },
              {
                label: "现持有",
                value: "in",
              },
            ] as any
          }
          onChange={doChange("type")}
          value={filter.type}
        />
      </div>
    </div>
  );
};

export default Filter;
