import type { NextPage } from "next";
import { Search } from "components/Home";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { push } = useRouter();

  const loadData = async (address: string) => {
    push(`/flips/${address}`);
  };
  return (
    <main className="px-4">
      <div className="content mx-auto py-10">
        <Search value={""} onChange={loadData} />
        <div className="mx-auto mt-6 max-w-[1200px] rounded-xl bg-gray-100 p-4 py-10 md:px-6">
          <div className="text-center">
            <div className="text-center text-2xl font-bold">查询结果示例</div>
            <p className="flex items-center justify-center text-sm text-gray-400">
              数据源Etherscan
              <img className="ml-2" src="/icons/ladder.svg" alt="" width={15} />
              <img src="/icons/ladder.svg" alt="" width={15} />
              <img src="/icons/ladder.svg" alt="" width={15} />
              <img src="/icons/ladder.svg" alt="" width={15} />
            </p>
          </div>
          <div className="mt-10 hidden md:!block">
            <img
              className="mx-auto rounded-2xl"
              src="/preview.jpg"
              alt="Preview"
            />
          </div>
          <div className="mt-4 md:hidden">
            <img className="rounded-2xl" src="/h5_preview.jpg" alt="Preview" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
