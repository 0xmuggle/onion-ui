import { Avatar } from "components/Common";

const StatisticsItem = ({ value = "-", children, className }: any) => (
  <div className="text-center">
    <div className={`${className} text-2xl font-bold`}>{value}</div>
    <div className={` text-sm text-gray-400`}>{children}</div>
  </div>
);

const Statistics = ({
  address,
  winFlips,
  loseFlips,
  totalSpend,
  totalProfits,
}: any) => {
  return (
    <div className="flex items-center rounded-xl border p-4 shadow">
      <Avatar size={70} avatar={address} />
      <div className="grid flex-1 grid-cols-4">
        <StatisticsItem value={winFlips} className="text-green-500">
          Winning Flips
        </StatisticsItem>
        <StatisticsItem value={loseFlips} className="text-red-500">
          Losing Flips
        </StatisticsItem>
        <StatisticsItem value={`${Number(totalSpend).toFixed(4)} E`}>
          Total Spend
        </StatisticsItem>
        <StatisticsItem
          value={`${totalProfits > 0 ? "+" : "-"}${Number(totalProfits).toFixed(
            4
          )} E`}
        >
          Total Profits
        </StatisticsItem>
      </div>
    </div>
  );
};

export default Statistics;
