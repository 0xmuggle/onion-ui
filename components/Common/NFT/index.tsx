import { useEffect, useRef, useState } from "react";
import { getById } from "./service";

interface NFTProps {
  contract: string;
  tokenId: string;
  tokenType: string;
}
const NFT = ({ contract, tokenId, tokenType }: NFTProps) => {
  const ref = useRef<any>();
  const [src, setSrc] = useState("");
  const lodaData = async () => {
    setSrc("");
    ref.current = false;
    const d = await getById(contract, tokenId, tokenType);
    const img = new Image();
    img.src = d;
    ref.current = true;
    img.onload = () => {
      if (ref.current) {
        setSrc(d);
      }
    };
  };

  useEffect(() => {
    lodaData();
  }, [contract, tokenId]);

  return (
    <div className="w-10">
      <div className="relative h-0 w-full overflow-hidden rounded-xl bg-gray-100 pb-[100%]">
        {src && (
          <img
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src={src}
            height={50}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default NFT;
