import { isEmpty, orderBy, sortBy } from "lodash";
import BN from "bignumber.js";
import { arrayFrom, queryCacheData, queryData } from "./tool";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

const filterStake = (nfts: any[] = []) => {
  // 筛选质押的NFT
  const stakeMap: any = {};
  nfts.forEach((item: any) => {
    const { hash, contractAddress: contract, to, from, functionName } = item;
    if (!stakeMap[hash]) {
      stakeMap[hash] = {
        contract,
        to,
      };
    } else if (
      stakeMap[hash] &&
      stakeMap[hash].contract !== contract &&
      ((stakeMap[hash].to !== zeroAddress && from === zeroAddress) ||
        (stakeMap[hash].to === zeroAddress && from !== zeroAddress))
    ) {
      stakeMap[hash] = true;
    }
  });
  return nfts.filter((item: any) => stakeMap[item.hash] !== true);
};

const getNftApprove = (item: any, erc: any) => {
  const { contractAddress: contract, tokenID } = item;
  return {
    contract,
    tokenID,
    tokenName: item.tokenName,
    type: "approve",
    inGasPrice: 0, // 转入时消耗的gas
    inGasUsed: 0,
    inValue: erc.value,
    outValue: 0, // 转出时消耗的ETH
    outGasPrice: 0, // 转出时消耗的gas
    outGasUsed: 0,
    count: erc.count,
    inTimeStamp: item.timeStamp,
  };
};
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
    tokenType: item.tokenValue !== undefined ? "1155" : "721",
  };
  if (isEmpty(erc)) {
    // nft inType transfer;
    return nft;
  }
  const gasUsed = item.gasUsed / count;
  nft.inValue = erc.value / count;

  if (!erc.isOwner && erc.value > 0) {
    nft.inType = "buy offer";
    return nft;
  }
  nft.inGasPrice = item.gasPrice;
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
  const gasUsed = item.gasUsed / count;
  if (erc.isOwner && erc.value > 0) {
    nft.outType = "sell offer";
    nft.outValue = value;
    nft.outGasPrice = item.gasPrice;
    nft.outGasUsed = gasUsed;
    return nft;
  }
  if (erc.isOwner && erc.value <= 0) {
    nft.outGasPrice = item.gasPrice;
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
const queryNfts = async (address: string, chain: string) => {
  const {
    nfts1155: cacheNfts1155,
    nfts721: cacheNfts721,
    erc20,
    intxs,
    txs,
  } = await queryData(address, chain);

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
  const approveTx: any = {};
  let balanceMap: any = {};
  txs.forEach((item: any) => {
    const { hash, functionName, to } = item;
    if (!balanceMap[hash]) {
      balanceMap[hash] = item;
    }
    if (intxsMap[hash]) {
      // 退款
      if (new BN(item.value).gt(intxsMap[hash].value)) {
        balanceMap[hash].value = new BN(balanceMap[hash].value)
          .minus(intxsMap[hash].value)
          .toString();
      } else {
        balanceMap[hash] = {
          ...balanceMap[hash],
          ...intxsMap[hash],
        };
      }
      delete intxsMap[hash];
    }
    balanceMap[hash].isOwner = true;

    if (functionName.includes("setApprovalForAll")) {
      const { gasPrice, gasUsed } = item;
      if (!approveTx[to]) {
        approveTx[to] = item;
      }
      approveTx[to].value = new BN(approveTx[to].value || 0)
        .plus(new BN(gasPrice).times(gasUsed))
        .toString();
      approveTx[to].count = (approveTx[to].count || 0) + 1;
    }
  });
  balanceMap = Object.assign(balanceMap, intxsMap);
  // ERC20
  erc20.forEach((item: any) => {
    const { hash } = item;
    if (balanceMap[hash]) {
      balanceMap[hash].value = new BN(balanceMap[hash].value)
        .plus(item.value)
        .toString();
    } else if (!balanceMap[hash] || item.to === address) {
      balanceMap[item.hash] = {
        ...balanceMap[item.hash],
        ...item,
      };
    }
  });
  // 处理数据
  // 筛选质押的NFT
  const nftMap: Record<string, boolean> = {};
  const nfts721 = filterStake(cacheNfts721);
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

  nfts721.forEach((item: any, index: number) => {
    const { tokenID, contractAddress: contract, from, hash } = item;
    const inKey = `${contract}-${tokenID}-in`;
    const outKey = `${contract}-${tokenID}-out`;
    const erc = balanceMap[hash] || {};

    if (!nftMap[inKey]) {
      nfts.push(getNftIn(item, erc, nftCountMap[hash]));
      nftMap[inKey] = true;
      nftMap[outKey] = false;

      if (approveTx[contract]) {
        nfts.push(getNftApprove(item, approveTx[contract]));
        delete approveTx[contract];
      }
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

  // 处理nft1155 同时过滤太多的数量
  const nfts1155 = filterStake(cacheNfts1155).filter(
    (item: any) => item.tokenValue < 200
  );
  nfts1155.forEach((item: any, index: number) => {
    const { tokenID, contractAddress: contract, to, tokenValue, hash } = item;
    const erc = balanceMap[hash] || {};
    const count = Number(tokenValue);
    if (to === address) {
      // in
      arrayFrom(count).forEach(() => {
        nfts.push(getNftIn(item, erc, count));
      });
      if (approveTx[contract]) {
        nfts.push(getNftApprove(item, approveTx[contract]));
        delete approveTx[contract];
      }
    } else {
      // out
      if (!(erc.functionName || "").toLocaleLowerCase().includes("stake")) {
        arrayFrom(count).forEach(() => {
          const index = nfts.findLastIndex(
            (n: any) =>
              n.type === "in" &&
              n.contract === contract &&
              n.tokenID === tokenID
          );
          if (index != -1) {
            nfts[index] = {
              ...nfts[index],
              ...getNftOut(item, erc, count),
            };
          }
        });
      }
    }
  });
  return sortBy(nfts, "inTimeStamp");
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
  let cost = 0; // 拥有nft数量
  let costSpend = new BN(0); // 拥有nft的花费
  let totalSpend = new BN(0); // 总花费
  let totalProfits = new BN(0); // 总盈利ETH花费
  let transfer = 0; // 转出nft数量
  let approves = 0; // 授权次数
  let approveSpend = new BN(0); // 授权消耗

  // 处理数据
  const datas = data.map((item: any) => {
    const inGas = new BN(item.inGasUsed).multipliedBy(item.inGasPrice);
    const outGas = new BN(item.outGasUsed).multipliedBy(item.outGasPrice);
    const inAmount = new BN(item.inValue);
    const outAmount = new BN(item.outValue);

    let flipsAmount = new BN(0);

    totalSpend = totalSpend.plus(outGas).plus(inGas).plus(item.inValue);

    if (item.type === "approve") {
      approves = approves + item.count;
      approveSpend = inAmount.plus(approveSpend);
    } else if (item.type === "in") {
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
    approves,
    approveSpend,
    totalSpend: totalSpend.minus(costSpend),
    totalProfits: totalProfits.minus(approveSpend),
    dataSources: datas.filter((item: any) => item.type !== "approve").reverse(),
  };
};

export default queryNfts;
