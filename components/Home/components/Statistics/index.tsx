import { StarIcon } from "@heroicons/react/24/outline";
import { Avatar } from "components/Common";
import { calcAmount } from "service/flips";
import { hideStr } from "utils/utils";

const StatisticsItem = ({ value = "-", children, className }: any) => (
  <div className="text-center">
    <div className={`${className} text-2xl font-bold`}>{value}</div>
    <div className={` text-sm text-gray-400`}>{children}</div>
  </div>
);

const Statistics = ({
  address,
  name,
  winFlips,
  loseFlips,
  totalSpend,
  totalProfits,
}: any) => {
  const totalProfit = calcAmount(totalProfits);
  return (
    <div className="flex items-center rounded-xl border px-4 py-6 shadow">
      <div className="flex items-center gap-2">
        <Avatar size={64} avatar={address || ""} />
        <div className="space-y-1">
          <div>{name !== address ? name : "Unknown"}</div>
          <div className="text-xs text-gray-400">{hideStr(address)}</div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-4">
        <StatisticsItem value={winFlips} className="text-green-500">
          Winning Flips
        </StatisticsItem>
        <StatisticsItem value={loseFlips} className="text-red-500">
          Losing Flips
        </StatisticsItem>
        <StatisticsItem value={`${calcAmount(totalSpend)} E`}>
          Total Spend
        </StatisticsItem>
        <StatisticsItem value={`${totalProfit} E`}>
          Total Profits
        </StatisticsItem>
      </div>
      <div className="pr-6">
        <StarIcon className="cursor-pointer text-gray-600" width={20} />
      </div>
    </div>
  );
};

export default Statistics;
