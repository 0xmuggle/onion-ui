import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { isEmpty, uniq } from "lodash";
import Link from "next/link";
import { hideStr } from "utils/utils";

const Search = ({ value, onChange }: any) => {
  const [caches, setCaches] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCache = () => {
    setCaches(
      JSON.parse(localStorage.getItem("caches-addr") || "[]").filter(
        (item: any) => item
      )
    );
  };

  const doChange = async (val = address) => {
    try {
      if (!val || loading) return;
      setLoading(true);
      const cachesAddr = JSON.parse(
        localStorage.getItem("caches-addr") || "[]"
      );
      localStorage.setItem(
        "caches-addr",
        JSON.stringify(uniq([...cachesAddr, address.toLowerCase()].slice(0, 6)))
      );
      loadCache();
      await onChange?.(val.toLowerCase());
    } finally {
      setLoading(false);
    }
  };

  const doChangeAddress = (e: any) => {
    const addr = e.target.value;
    setAddress(addr);
  };

  useEffect(() => {
    const val = value.toLowerCase();
    setAddress(val);
    doChange(val);
  }, [value]);

  useEffect(() => {
    loadCache();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <input
          type="text"
          placeholder="输入ETH地址或者ENS"
          className="input input-bordered w-full rounded-full"
          value={address}
          onChange={doChangeAddress}
        />
        <div
          onClick={() => doChange()}
          className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary"
        >
          {loading ? (
            <ArrowPathIcon className="animate-spin" width={24} />
          ) : (
            <MagnifyingGlassIcon width={24} />
          )}
        </div>
      </div>
      <div className="flex flex-wrap p-2 text-xs text-gray-400">
        最近搜索:
        {isEmpty(caches)
          ? "空"
          : caches.map((item: string) => (
              <Link key={item} href={`/flips/${item}`}>
                <a className="ml-2 hover:text-purple-400">
                  {item.endsWith("eth") ? item : hideStr(item)}
                </a>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Search;
