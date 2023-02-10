import { useEffect, useState } from "react";
import { getById } from "./service";

interface NFTProps {
  contract: string;
  tokenId: string;
  tokenType: string;
}
const NFT = ({ contract, tokenId, tokenType }: NFTProps) => {
  const [src, setSrc] = useState("");
  const lodaData = async () => {
    setSrc("");
    const d = await getById(contract, tokenId, tokenType);
    setSrc(d);
  };

  useEffect(() => {
    lodaData();
  }, [contract, tokenId]);

  return (
    <div className="w-10">
      <div className="h-0 w-full overflow-hidden rounded-xl bg-gray-100 pb-[100%]">
        {src && <img src={src} height={50} alt="" />}
      </div>
    </div>
  );
};

export default NFT;
