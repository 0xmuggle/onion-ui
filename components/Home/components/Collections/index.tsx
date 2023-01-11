import { Checkbox } from "components/Common";
import { useState } from "react";

const Collections = ({ collections = [], onChange }: any) => {
  const [keyword, setKeyword] = useState("");
  const changeWord = (e: any) => {
    setKeyword(e.target.value);
  };
  return (
    <div className="break-all rounded-xl border pb-4">
      <div className="p-4 font-bold">NFT合集</div>
      <div className="px-4 pb-2">
        <input
          onChange={changeWord}
          value={keyword}
          placeholder="合集名"
          className="input input-bordered input-sm w-full text-sm"
        />
      </div>
      <div className="max-h-[400px] overflow-auto px-4">
        <Checkbox
          onChange={onChange}
          options={collections
            .filter((item: any) => item.includes(keyword))
            .map((item: any) => ({
              value: item,
            }))}
        />
      </div>
    </div>
  );
};

export default Collections;
