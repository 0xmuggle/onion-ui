import BN from "bignumber.js";
import classNames from "classnames";

const SearchList = ({ list }: any) => {
  const calcAmount = (value: BN) => {
    return value.div(1e18).toNumber();
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>NFT</th>
            <th>购入价</th>
            <th>卖出价</th>
            <th>盈利</th>
          </tr>
        </thead>
        <tbody>
          {list
            .map((item: any) => {
              const inGas = new BN(item.inGasUsed * item.inGasPrice);
              const outGas = new BN(item.outGasUsed * item.outGasPrice);
              const inAmount = new BN(item.inValue).plus(inGas);
              const outAmount = new BN(item.outValue).plus(inGas);
              return {
                ...item,
                inGas: calcAmount(inGas),
                outGas: calcAmount(outGas),
                inAmount: calcAmount(inAmount),
                outAmount: calcAmount(outAmount),
                flipsAmount: calcAmount(outAmount.minus(inAmount)),
              };
            })
            .map((item: any) => (
              <tr key={item.hash}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="/tailwind-css-component-profile-2@56w.png"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.tokenName}</div>
                      <div className="text-sm opacity-50">#{item.tokenID}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-base font-bold">{item.inAmount} E</div>
                  <div className="text-xs text-gray-400">
                    gas: {item.inGas} e
                  </div>
                </td>
                <td>
                  <div>
                    <div className="text-base font-bold">
                      {item.outAmount} E
                    </div>
                    <div className="text-xs text-gray-400">
                      gas: {item.outGas} e
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    className={classNames("font-bold", {
                      "text-red-400": item.flipsAmount < 0,
                      "text-green-400": item.flipsAmount >= 0,
                    })}
                  >
                    {item.flipsAmount} E
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchList;
