import axios from "axios";
import { isEmpty, keyBy } from "lodash";
import BN from "bignumber.js";

// BUG 0xee3b8af0874416cd5b643ade0f34b3d51be1deb3

const zeroAddress = "0x0000000000000000000000000000000000000000";
const ETHERESCAN_API_KEY = "ZTCEJ9279MFUH58P6ZAVRQTZ2FJAF5K15G";
const chainApi: any = {
  ether: "https://api.etherscan.io/api",
};
const ERC20s = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x0000000000a39bb272e79075ade125fd351887ac",
];

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}

const getItem = (key: string, defaultValue: string) => {
  return JSON.parse(localStorage.getItem(key) || defaultValue);
}

const query = async (params = {}, chain = "ether") => {
  const { data } = await axios.get(`${chainApi[chain]}`, {
    timeout: 60 * 1000,
    params: {
      offset: 10000,
      sort: "asc",
      ...params,
      apiKey: ETHERESCAN_API_KEY,
    },
  });
  return data.result;
};

export const queryAll = async (params = {}, chain = "ether") => {
  let flag = true;
  let page = 0;
  let list: any = [];
  do {
    page += 1;
    const data = await query(
      {
        ...params,
        page,
      },
      chain
    );
    flag = data.length === 10000;
    list = list.concat(data);
  } while (flag);
  return list;
};


const queryERC20 = async (address: string, startblock = 1) => {
  let erc: any = [];
  for (let i = 0; i < ERC20s.length; i++) {
    const contractaddress = ERC20s[i];
    const erc20 = await queryAll({
      address,
      contractaddress,
      module: "account",
      action: "tokentx",
      startblock,
    });
    erc = erc.concat(erc20);
  }
  return erc;
};

const initValue = {
  nft721Block: 0,
  txsBlock: 0,
  intxsBlock: 0,
  erc20Block: 0,
  nfts721: [],
  erc20: [],
  txs: [],
  intxs: [],
}
const queryData = async (address: string) => {
  const { 
    nft721Block, 
    txsBlock, 
    intxsBlock, 
    erc20Block, 
    ...cacheData 
  } = getItem(address, JSON.stringify(initValue));
  // 查询721
  const nfts721 = await queryAll({
    address,
    module: "account",
    action: "tokennfttx",
    startblock: nft721Block + 1, 
  });
  // 查询普通交易
  const txs = await queryAll({
    address,
    module: "account",
    action: "txlist",
    startblock: txsBlock + 1, 
  });

  // 查询内联交易
  const intxs = await queryAll({
    address,
    module: "account",
    action: "txlistinternal",
    startblock: intxsBlock + 1, 
  });

  // 查询ERC20
  const erc20 = await queryERC20(address, erc20Block + 1);

  const result = {
    nft721Block: nfts721.length > 0 ? Number(nfts721[0].blockNumber) : nft721Block,
    txsBlock: txs.length > 0 ? Number(txs[0].blockNumber) : txsBlock,
    intxsBlock: intxs.length > 0 ? Number(intxs[0].blockNumber) : intxsBlock,
    erc20Block: erc20.length > 0 ? Number(erc20[0].blockNumber) : erc20Block,
    erc20: cacheData.erc20.concat(erc20),
    nfts721: cacheData.nfts721.concat(nfts721),
    intxs: cacheData.intxs.concat(intxs),
    txs: cacheData.txs.concat(txs),
  }
  // setItem(address, result);
  return result;
}

const getNftIn = (item: any, erc: any, count = 1) => {
  const { tokenID, contractAddress: contract, from, hash } = item;
  const nft: any = {
    contract,
    tokenID,
    tokenName: item.tokenName,
    inHash: hash, // 转入时hash
    type: "in",
    inType: "transfer",
    inValue: 0, // 转入时消耗的ETH
    inGasPrice: 0, // 转入时消耗的gas
    inGasUsed: 0,
    inTimeStamp: item.timeStamp, // 转入时时间
    outType: "transfer",
    outValue: 0, // 转出时消耗的ETH
    outGasPrice: 0, // 转出时消耗的gas
    outGasUsed: 0,
  };
  if(isEmpty(erc)) { // nft inType transfer;
    return nft;
  }
  const gasUsed = erc.gasUsed / count;
  nft.inValue = erc.value / count;

  if(!erc.isOwner && erc.value > 0) {
    nft.inType = "offer";
    return nft;
  }
  nft.inGasPrice = erc.gasPrice;
  nft.inGasUsed = gasUsed;
  nft.inType = from === zeroAddress ? 'mint' : 'buy';
  return nft;
}

const getNftOut = (item: any, erc: any, count = 1) => {
  const { hash, timeStamp, to } = item;
  const nft: any = {
    type: 'out',
    outHash: hash,
    outTimeStamp: timeStamp,
  };
  if(isEmpty(erc)) {
    nft.outType = 'reclaim';
    return nft;
  }
  const value = erc.value / count;
  const gasUsed = erc.gasUsed / count;
  if (erc.isOwner && erc.value > 0) {
    nft.outType = "offer sell";
    nft.outValue = value;
    nft.outGasPrice = erc.gasPrice;
    nft.outGasUsed = gasUsed;
    return nft;
  }
  if (erc.isOwner && erc.value <= 0) {
    nft.outGasPrice = erc.gasPrice;
    nft.outGasUsed = gasUsed;
    if(to === zeroAddress) {
      nft.outType = "burn";
    } else {
      nft.outType = "transfer";
    }
    return nft;
  }
  if(!erc.isOwner && erc.value > 0) {
    nft.outType = "sell";
    nft.outValue = value;
  }
  return nft;
}

const queryNfts = async (address: string) => {
  const { 
    nfts721,
    erc20,
    intxs,
    txs,
  } = await queryData(address);
  
  const intxsMap: any = {};
  intxs.forEach((item: any) => {
    const { hash, value, from, to } = item;
    if(intxsMap[hash]) {
      intxsMap[hash].value = new BN(intxsMap[hash].value)
        .plus(value)
        .toString();
    } else {
      intxsMap[hash] = item;
    }
  });
  // 普通交易
  let balanceMap: any = { };
  txs.forEach((item: any) => {
    const { hash } = item;
    if(!balanceMap[hash]) {
      balanceMap[hash] = item;
    }
    if(intxsMap[hash]) {
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
    if(!nftCountMap[hash]) {
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
        ...getNftOut(item, erc, nftCountMap[hash])
      };
      nftMap[inKey] = false;
      nftMap[outKey] = true;
    }
  });
  return nfts;
};

const flips = async (address: string) => {
  const nfts = await queryNfts(address);
  return nfts;
};

export const calcAmount = (value: any) => {
  if (BN.isBigNumber(value)) {
    return value.div(1e18).toFixed(3);
  }
  return 0;
};

export const flipsDtatistics = (data: any) => {
  let winFlips = 0;
  let loseFlips = 0;
  let totalSpend = new BN(0);
  let totalRecive = new BN(0);

  // 处理数据
  const datas = data
    .filter((item: any) => item.type === "out")
    .map((item: any) => {
      const inGas = new BN(item.inGasUsed * item.inGasPrice);
      const outGas = new BN(item.outGasUsed * item.outGasPrice);
      const inAmount = new BN(item.inValue);
      const outAmount = new BN(item.outValue);
      const flipsAmount = outAmount.minus(inAmount).minus(outGas).minus(inGas);
      if(item.outType !== 'transfer') {
        if (Number(flipsAmount) > 0) {
          winFlips += 1;
        } else {
          loseFlips += 1;
        }
      }
      totalSpend = totalSpend.plus(outGas).plus(inGas).plus(item.inValue);
      totalRecive = totalRecive.plus(outAmount).minus(outGas);
      return {
        ...item,
        inGas,
        outGas,
        inAmount,
        outAmount,
        flipsAmount,
      };
    })
    .sort((pre: any, next: any) => pre.outTimeStamp - next.outTimeStamp)
  return {
    winFlips,
    loseFlips,
    totalSpend,
    totalRecive,
    totalProfits: totalRecive.minus(totalSpend),
    dataSources: datas,
  };
};

export default flips;
