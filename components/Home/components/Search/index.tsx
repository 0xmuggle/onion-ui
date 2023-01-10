import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const Search = ({ value, onChange }: any) => {
  const [address, setAddress] = useState(value);
  const [loading, setLoading] = useState(false);

  const doChange = async () => {
    if (!address || loading) return;
    setLoading(true);
    await onChange?.(address.toLowerCase());
    setLoading(false);
  };

  const doChangeAddress = (e: any) => {
    const addr = e.target.value;
    setAddress(addr);
  };

  const doKeyDown = (e: any) => {
    if (e.code === "Enter") {
      doChange();
    }
  };

  useEffect(() => {
    doChange();
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl">
      <input
        type="text"
        placeholder="输入ETH地址或者ENS"
        className="input input-bordered w-full"
        value={address}
        onChange={doChangeAddress}
        onKeyDown={doKeyDown}
      />
      <div
        onClick={doChange}
        className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary"
      >
        {loading ? (
          <ArrowPathIcon className="animate-spin" width={24} />
        ) : (
          <MagnifyingGlassIcon width={24} />
        )}
      </div>
    </div>
  );
};

export default Search;
