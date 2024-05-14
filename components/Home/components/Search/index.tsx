import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { isEmpty, uniq } from "lodash";
import Link from "next/link";
import { hideStr } from "utils/utils";

const Search = ({ value, onChange }: any) => {
  const [caches, setCaches] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [chain, setChain] = useState("");

  const loadCache = () => {
    setCaches(
      JSON.parse(localStorage.getItem("caches-addr") || "[]").filter(
        (item: any) => item
      )
    );
    setChain(localStorage.getItem("caches-chain") || "ether");
  };

  const changeChain = async (val: string) => {
    if (loading) return;
    localStorage.setItem("caches-chain", val);
    setChain(val);
  };

  const doChange = async (val = address) => {
    try {
      let c: any = chain;
      if (!c) {
        c = localStorage.getItem("caches-chain");
      }
      if (!val || loading || !c) return;
      setLoading(true);
      const cachesAddr = JSON.parse(
        localStorage.getItem("caches-addr") || "[]"
      );
      localStorage.setItem(
        "caches-addr",
        JSON.stringify(
          uniq([address.toLowerCase(), ...cachesAddr].slice(0, 10))
        )
      );
      loadCache();
      await onChange?.(val.toLowerCase(), c);
    } finally {
      setLoading(false);
    }
  };

  const doKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      doChange();
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

  const clear = () => {
    setCaches([]);
    localStorage.removeItem("caches-addr");
  };

  useEffect(() => {
    loadCache();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <div className="absolute bottom-0 left-0 top-0 flex cursor-pointer border-r">
          <div
            onClick={() => changeChain("ether")}
            className={classNames("flex items-center p-2 opacity-40", {
              "!opacity-100": chain === "ether",
            })}
          >
            <img src={`/icons/eth.svg`} alt="" width={20} />
          </div>
          <div
            onClick={() => changeChain("blast")}
            className={classNames("flex items-center p-2 opacity-40", {
              "!opacity-100": chain === "blast",
            })}
          >
            <img src={`/icons/blast.svg`} alt="" width={20} />
          </div>
        </div>
        <input
          type="text"
          placeholder="输入ETH地址或者ENS"
          className="input input-bordered w-full rounded-full pl-20 pr-20"
          value={address}
          onChange={doChangeAddress}
          onKeyDown={doKeyDown}
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
      <div className="flex flex-wrap items-center p-2 text-xs text-gray-400">
        {!isEmpty(caches) && (
          <div
            className="tooltip mr-2 cursor-pointer hover:text-primary"
            data-tip="清空历史记录"
          >
            <XCircleIcon width={16} onClick={clear} />
          </div>
        )}
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
