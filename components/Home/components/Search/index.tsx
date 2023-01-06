import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Search = ({ value, onChange }: any) => {
  const [address, setAddress] = useState(value);

  const doChange = () => {
    if (!address) return;
    if (!ethers.utils.isAddress(address)) {
      toast.warn("Address is invalid.");
      return;
    }
    onChange?.(address);
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
        <MagnifyingGlassIcon width={24} />
      </div>
    </div>
  );
};

export default Search;
