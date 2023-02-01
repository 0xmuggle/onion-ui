import { isEmpty, orderBy } from "lodash";
import BN from "bignumber.js";
import { queryCacheData, queryData } from "./tool";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

const getNftIn = (item: any, erc: any, count = 1) => {
  const { tokenID, contractAddress: contract, from, hash } = item;
  const nft: any = {
    contract,
    tokenID,
    tokenName: item.tokenName,
    inHash: hash, // 转入时hash
    type: "in",
    inType: "transfer in",
    inValue: 0, // 转入时消耗的ETH
    inGasPrice: 0, // 转入时消耗的gas
    inGasUsed: 0,
    inTimeStamp: item.timeStamp, // 转入时时间
    outType: "transfer out",
    outValue: 0, // 转出时消耗的ETH
    outGasPrice: 0, // 转出时消耗的gas
    outGasUsed: 0,
  };
  if (isEmpty(erc)) {
    // nft inType transfer;
    return nft;
  }
  const gasUsed = erc.gasUsed / count;
  nft.inValue = erc.value / count;

  if (!erc.isOwner && erc.value > 0) {
    nft.inType = "buy offer";
    return nft;
  }
  nft.inGasPrice = erc.gasPrice;
  nft.inGasUsed = gasUsed;
  nft.inType = from === zeroAddress ? "mint" : "buy";
  return nft;
};

const getNftOut = (item: any, erc: any, count = 1) => {
  const { hash, timeStamp, to } = item;
  const nft: any = {
    type: "out",
    outHash: hash,
    outTimeStamp: timeStamp,
  };
  if (isEmpty(erc)) {
    nft.outType = "reclaim";
    return nft;
  }
  const value = erc.value / count;
  const gasUsed = erc.gasUsed / count;
  if (erc.isOwner && erc.value > 0) {
    nft.outType = "sell offer";
    nft.outValue = value;
    nft.outGasPrice = erc.gasPrice;
    nft.outGasUsed = gasUsed;
    return nft;
  }
  if (erc.isOwner && erc.value <= 0) {
    nft.outGasPrice = erc.gasPrice;
    nft.outGasUsed = gasUsed;
    if (to === zeroAddress) {
      nft.outType = "burn";
    } else {
      nft.outType = "transfer out";
    }
    return nft;
  }
  if (!erc.isOwner && erc.value > 0) {
    nft.outType = "sell";
    nft.outValue = value;
  }
  return nft;
};

const queryNfts = async (address: string) => {
  const { nfts721, erc20, intxs, txs } = await queryData(address);

  const intxsMap: any = {};
  intxs.forEach((item: any) => {
    const { hash, value, from, to } = item;
    if (intxsMap[hash]) {
      intxsMap[hash].value = new BN(intxsMap[hash].value)
        .plus(value)
        .toString();
    } else {
      intxsMap[hash] = item;
    }
  });
  // 普通交易
  let balanceMap: any = {};
  txs.forEach((item: any) => {
    const { hash } = item;
    if (!balanceMap[hash]) {
      balanceMap[hash] = item;
    }
    if (intxsMap[hash]) {
      balanceMap[hash].value = new BN(balanceMap[hash].value)
        .minus(intxsMap[hash].value)
        .toString();
      delete intxsMap[hash];
    }
    balanceMap[hash].isOwner = true;
  });
  balanceMap = Object.assign(balanceMap, intxsMap);

  // ERC20
  erc20.forEach((item: any) => {
    const { hash } = item;
    if (balanceMap[hash]) {
      balanceMap[hash].value = new BN(balanceMap[hash].value)
        .plus(item.value)
        .toString();
    }
    if (!balanceMap[hash] || item.to === address) {
      balanceMap[item.hash] = {
        ...balanceMap[item.hash],
        ...item,
      };
    }
  });

  // 处理数据
  const nftMap: Record<string, boolean> = {};
  const nfts: any = [];
  // 处理nfts
  // 买卖NFT的次数统计
  const nftCountMap: Record<string, number> = {};
  nfts721.forEach((item: any) => {
    const { hash } = item;
    if (!nftCountMap[hash]) {
      nftCountMap[hash] = 0;
    }
    nftCountMap[hash] += 1;
  });

  nfts721.forEach((item: any) => {
    const { tokenID, contractAddress: contract, from, hash } = item;
    const inKey = `${contract}-${tokenID}-in`;
    const outKey = `${contract}-${tokenID}-out`;
    const erc = balanceMap[hash] || {};
    if (!nftMap[inKey]) {
      nfts.push(getNftIn(item, erc, nftCountMap[hash]));
      nftMap[inKey] = true;
      nftMap[outKey] = false;
    } else if (!nftMap[outKey]) {
      const index = nfts.findLastIndex(
        (n: any) =>
          n.type === "in" && n.contract === contract && n.tokenID === tokenID
      );
      nfts[index] = {
        ...nfts[index],
        ...getNftOut(item, erc, nftCountMap[hash]),
      };
      nftMap[inKey] = false;
      nftMap[outKey] = true;
    }
  });
  return nfts;
};

export const calcAmount = (value: any) => {
  if (BN.isBigNumber(value) && !value.eq(0)) {
    return value.div(1e18).toFixed(3);
  }
  return 0;
};

export const flipsDtatistics = (data: any) => {
  let winFlips = 0;
  let loseFlips = 0;
  let cost = 0; // 有用nft数量
  let costSpend = new BN(0); // 拥有nft的花费
  let totalSpend = new BN(0);
  let totalProfits = new BN(0);
  let transfer = 0; // 转出nft数量

  // 处理数据
  const datas = data.map((item: any) => {
    const inGas = new BN(item.inGasUsed).multipliedBy(item.inGasPrice);
    const outGas = new BN(item.outGasUsed).multipliedBy(item.outGasPrice);
    const inAmount = new BN(item.inValue);
    const outAmount = new BN(item.outValue);

    let flipsAmount = new BN(0);

    totalSpend = totalSpend.plus(outGas).plus(inGas).plus(item.inValue);

    if (item.type === "in") {
      cost += 1;
      costSpend = costSpend.plus(inAmount).plus(inGas);
    } else if (item.outType === "transfer out") {
      transfer += 1;
      flipsAmount = flipsAmount.minus(outGas).minus(inGas);
    } else {
      flipsAmount = outAmount.minus(inAmount).minus(outGas).minus(inGas);
      if (Number(flipsAmount) >= 0) {
        winFlips += 1;
      } else {
        loseFlips += 1;
      }
    }
    totalProfits = totalProfits.plus(flipsAmount);
    return {
      ...item,
      inGas,
      outGas,
      inAmount,
      outAmount,
      flipsAmount,
    };
  });
  return {
    cost,
    costSpend,
    transfer,
    winFlips,
    loseFlips,
    totalSpend: totalSpend.minus(costSpend),
    totalProfits,
    dataSources: datas.reverse(),
  };
};

export default queryNfts;
