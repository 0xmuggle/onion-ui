import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const Search = ({ value, onChange }: any) => {
  const { push, query } = useRouter();
  const [address, setAddress] = useState(value);
  const [loading, setLoading] = useState(false);

  const doChange = async () => {
    let addr = address;
    if (!addr || loading) return;
    setLoading(true);
    if (addr.endsWith(".eth")) {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/5e121bf717404855950bfe9831bfd4b1"
      );
      addr = await provider.resolveName(addr);
    }
    if (!ethers.utils.isAddress(addr)) {
      toast.warn("Address is invalid.");
    } else {
      push(`/${addr}`);
      await onChange?.(addr, address);
    }
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
        placeholder="Ether Adress"
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
