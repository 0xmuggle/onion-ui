import { StarIcon } from "@heroicons/react/24/outline";
import { Avatar } from "components/Common";
import { toast } from "react-toastify";
import { calcAmount, zeroAddress } from "service/flips";
import { hideStr } from "utils/utils";

const StatisticsItem = ({ value = "-", children, className, loading }: any) => (
  <div className="text-center">
    <div className={`${className} text-2xl font-bold`}>
      {loading ? "···" : value}
    </div>
    <div className={` text-sm text-gray-400`}>{children}</div>
  </div>
);

const Statistics = ({
  loading,
  address,
  name,
  winFlips,
  loseFlips,
  totalSpend,
  totalProfits,
}: any) => {
  const totalProfit = calcAmount(totalProfits);
  const doClick = () => {
    toast.info("功能开发中，敬请期待...");
  };
  return (
    <div className="flex items-center rounded-xl border px-4 py-6 shadow">
      <div className="flex items-center gap-2">
        <Avatar size={64} avatar={loading ? zeroAddress : address} />
        <div className="space-y-1">
          <div>{loading ? "..." : name !== address ? name : "Unknown"}</div>
          <div className="text-xs text-gray-400">
            {loading ? "···" : hideStr(address)}
          </div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-4">
        <StatisticsItem
          value={winFlips}
          className="text-green-500"
          loading={loading}
        >
          盈利操作
        </StatisticsItem>
        <StatisticsItem
          value={loseFlips}
          className="text-red-500"
          loading={loading}
        >
          亏损操作
        </StatisticsItem>
        <StatisticsItem value={`${calcAmount(totalSpend)} E`} loading={loading}>
          总花费
        </StatisticsItem>
        <StatisticsItem value={`${totalProfit} E`} loading={loading}>
          总盈收
        </StatisticsItem>
      </div>
      <div className="pr-6">
        <StarIcon
          onClick={doClick}
          className="cursor-pointer text-gray-600"
          width={20}
        />
      </div>
    </div>
  );
};

export default Statistics;
