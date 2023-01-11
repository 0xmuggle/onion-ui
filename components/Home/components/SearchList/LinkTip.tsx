const typeMap: any = {
  opensea: "https://opensea.io/assets/ethereum/",
  "opensea-account": "https://opensea.io/assets/ethereum/",
  etherscan: "https://etherscan.io/tx/",
};
const LinkTip = ({ children, type = "etherscan", value = "" }: any) => {
  return (
    <div className="flex items-center">
      <a
        target="_blank"
        href={`${typeMap[type]}${value}`}
        className="mr-1 inline-block w-5"
        rel="noreferrer"
      >
        <img src={`/icons/${type}.svg`} alt="" />
      </a>
      <div>{children}</div>
    </div>
  );
};

export default LinkTip;
