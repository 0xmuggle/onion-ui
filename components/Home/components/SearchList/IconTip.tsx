const typeTip: any = {
  "transfer in": "转入",
  "buy offer": "接受报价买入", // value
  buy: "买入", // value + gas
  mint: "铸造",

  "transfer out": "转出",
  "sell offer": "接受报价卖出", // value - gas
  sell: "卖出", // value
  burn: "销毁",
};
const LinkTip = ({ type = "transfer in" }: any) => {
  return (
    <div className="tooltip ml-1 align-middle" data-tip={typeTip[type]}>
      <img src={`/icons/${type}.svg`} alt="" width={16} />
    </div>
  );
};

export default LinkTip;
