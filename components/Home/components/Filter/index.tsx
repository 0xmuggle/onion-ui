import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Select from "react-select";

const Filter = ({ collections = [], onChange, address }: any) => {
  const [filter, setFilter] = useState({
    collections: [],
    visible: false,
  });
  const changeWord = (vals: any) => {
    const nextFilter = {
      ...filter,
      collections: vals,
    };
    setFilter(nextFilter);
    onChange?.(nextFilter);
  };
  const changeVisible = (e: any) => {
    const nextFilter = {
      ...filter,
      visible: e.target.checked,
    };
    setFilter(nextFilter);
    onChange?.(nextFilter);
  };
  useEffect(() => {
    setFilter({
      collections: [],
      visible: false,
    });
  }, [address]);
  return (
    <div className="flex items-center gap-x-6 pt-6 pb-4 text-sm">
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
          onChange={changeWord}
          value={filter.collections}
        />
      </div>
      <label className="swap">
        <input
          type="checkbox"
          checked={filter.visible}
          onChange={changeVisible}
        />
        <div className="swap-on">
          <EyeIcon width={20} />
        </div>
        <div className="swap-off">
          <EyeSlashIcon width={20} />
        </div>
        <span className="pl-6">隐藏持有NFT</span>
      </label>
    </div>
  );
};

export default Filter;
