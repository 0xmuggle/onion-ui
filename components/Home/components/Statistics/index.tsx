import { ShareIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Avatar } from "components/Common";
import { isEmpty } from "lodash";
import { calcAmount, zeroAddress } from "service/flips";
import { hideStr } from "utils/utils";

const StatisticsItem = ({
  value = "-",
  subfix = 0,
  children,
  className,
  loading,
}: any) => (
  <div className="text-center">
    <div
      className={`${className} flex items-center justify-center text-xl font-bold`}
    >
      {loading ? "···" : value}
      {subfix > 0 && (
        <div
          className="tooltip ml-1 align-middle text-gray-400"
          data-tip={`包含${subfix}次转出(转出亏损gas)`}
        >
          <InformationCircleIcon width={20} />
        </div>
      )}
    </div>
    <div className={` text-xs text-gray-400`}>{children}</div>
  </div>
);

const Statistics = ({
  hideUser = false,
  loading,
  address,
  name,
  cost,
  transfer,
  costSpend,
  winFlips,
  loseFlips,
  totalSpend,
  totalProfits,
  collections = [],
}: any) => {
  const getShareTxt = () => {
    const shareTxt = `${name !== address ? name : hideStr(address)} 总购入了 ${
      cost + winFlips + loseFlips
    } 个${
      isEmpty(collections) ? "" : ` “${collections.join("、")}” `
    }NFT。 花费 ${calcAmount(totalSpend)} ETH，已实现盈亏 ${calcAmount(
      totalProfits
    )} ETH。当前仍持有 ${cost} 个NFT，持有成本 ${calcAmount(costSpend)} ETH。`;
    return shareTxt;
  };
  return (
    <div>
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-2 pb-4">
          {!hideUser && (
            <>
              <Avatar size={48} avatar={loading ? zeroAddress : address} />
              <a
                target="_blank"
                href={`https://opensea.io/account/${address}`}
                className="flex-1 space-y-1"
                rel="noreferrer"
              >
                <div>
                  {loading ? "..." : name !== address ? name : "Unknown"}
                </div>
                <div className="text-xs text-gray-400">
                  {loading ? "···" : hideStr(address)}
                </div>
              </a>
            </>
          )}
          {!loading && (
            <div
              className="tooltip cursor-pointer text-left"
              data-tip={getShareTxt()}
            >
              <a
                className="text-blue-500"
                target="_blank"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  getShareTxt() + `#OnionNFT #Fliper ${location.href}`
                )}`}
                rel="noreferrer"
              >
                <ShareIcon width={20} />
              </a>
            </div>
          )}
        </div>
        <div>
          {!isEmpty(collections) && (
            <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-gray-50 p-4">
              {collections.map((item: any) => (
                <div className="badge badge-outline badge-sm" key="item">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6 border-b border-dotted pb-4">
          <StatisticsItem
            value={winFlips}
            className="text-green-500"
            loading={loading}
          >
            盈利操作
          </StatisticsItem>
          <StatisticsItem
            value={loseFlips + transfer}
            className="text-red-500"
            loading={loading}
            subfix={transfer}
          >
            亏损操作
          </StatisticsItem>
          <StatisticsItem value={calcAmount(totalSpend)} loading={loading}>
            总花费(ETH)
          </StatisticsItem>
          <StatisticsItem value={calcAmount(totalProfits)} loading={loading}>
            已实现盈亏(ETH)
          </StatisticsItem>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6 pt-4">
          <StatisticsItem
            value={cost}
            className="text-blue-500"
            loading={loading}
          >
            现持有NFT
          </StatisticsItem>
          <StatisticsItem value={calcAmount(costSpend)} loading={loading}>
            持有成本(ETH)
          </StatisticsItem>
        </div>
        <div className="flex items-center justify-center space-x-2 pt-4 text-xs text-gray-400">
          <img alt="" width={20} src="/favicon.ico" />
          <span>onion.moneystory.dev</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
