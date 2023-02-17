const linkMap: any = {
  opensea: "https://opensea.io/assets/ethereum/",
  "opensea-account": "https://opensea.io/assets/ethereum/",
  etherscan: "https://etherscan.io/tx/",
  "blur-account": "https://blur.io/",
  blur: "https://blur.io/collection/",
};
const LinkTip = ({
  children,
  type = "etherscan",
  value = "",
  width = 16,
}: any) => {
  const icon =
    type.indexOf("-") !== -1 ? type.slice(0, type.indexOf("-")) : type;
  if (!value) {
    return children || <img src={`/icons/${icon}.svg`} alt="" width={width} />;
  }
  return (
    <a
      target="_blank"
      href={`${linkMap[type]}${value}`}
      className="inline-block"
      rel="noreferrer"
    >
      {children || <img src={`/icons/${icon}.svg`} alt="" width={width} />}
    </a>
  );
};

export default LinkTip;
