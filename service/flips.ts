import axios from "axios";
import { keyBy } from "lodash";

const zeroAddress = "0x0000000000000000000000000000000000000000";
const ETHERESCAN_API_KEY = "ZTCEJ9279MFUH58P6ZAVRQTZ2FJAF5K15G";
const chainApi: any = {
  ether: "https://api.etherscan.io/api",
};
const ERC20s = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x0000000000a39bb272e79075ade125fd351887ac",
];

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

const queryInternal = async (address: string) => {
  return await queryAll({
    address,
    module: "account",
    action: "txlistinternal",
  });
};

const queryERC20 = async (address: string) => {
  let erc: any = [];
  for (let i = 0; i < ERC20s.length; i++) {
    const contractaddress = ERC20s[i];
    const erc20 = await queryAll({
      address,
      contractaddress,
      module: "account",
      action: "tokentx",
    });
    erc = erc.concat(erc20);
  }
  return erc;
};

const queryTx = async (address: string) => {
  return await queryAll({
    address,
    module: "account",
    action: "txlist",
  });
};

const queryNfts = async (address: string) => {
  // 查询721
  const nfts721 = await queryAll({
    address,
    module: "account",
    action: "tokennfttx",
  });

  // 查询1155
  // const nfts1155 = await query({
  //   address,
  //   module: 'account',
  //   action: 'token1155tx',
  // });
  // const nftsArr = nfts721.concat(nfts1155).sort((prev: any, next: any) => prev.blockNumber - next.blockNumber);

  // 查询普通交易
  const txs = await queryTx(address);
  const txsMap = keyBy(
    txs.map((item: any) => ({ ...item, isOwner: true })),
    "hash"
  );
  // 查询ERC20
  const erc20 = await queryERC20(address);
  // 查询内联交易
  const intxs = keyBy(await queryInternal(address), "hash");

  const balanceMap = { ...txsMap, ...intxs };

  erc20.forEach((item: any) => {
    const { hash } = item;
    if (!balanceMap[hash] || item.to === address) {
      balanceMap[item.hash] = item;
    }
    if (txsMap[hash]) {
      // buy
      balanceMap[item.hash].isOwner = true;
    }
  });

  // 处理数据
  const nftMap: Record<string, boolean> = {};
  const nfts: any = [];
  nfts721.forEach((item: any) => {
    const { tokenID, contractAddress: contract, from, hash } = item;
    const inKey = `${contract}-${tokenID}-in`;
    const outKey = `${contract}-${tokenID}-out`;
    const erc = balanceMap[hash] || {};
    if (item.tokenName === "Lil Duckies") {
      console.log(">> erc", erc);
      console.log(">> item", item);
    }
    if (!nftMap[inKey]) {
      const nft: any = {
        contract,
        tokenID,
        tokenName: item.tokenName,
        inHash: hash,
        type: "in",
        inType: "transfer",
        inValue: 0,
        inGasPrice: 0,
        inGasUsed: 0,
        outType: "transfer",
        outValue: 0,
        outGasPrice: 0,
        outGasUsed: 0,
      };
      if (from === zeroAddress) {
        nft.inType = "mint";
        nft.inValue = erc.value;
        nft.inGasPrice = erc.gasPrice;
        nft.inGasUsed = erc.gasUsed;
      } else if (erc.isOwner) {
        nft.inType = "buy";
        nft.inValue = erc.value;
        nft.inGasPrice = erc.gasPrice;
        nft.inGasUsed = erc.gasUsed;
      } else if (!erc.isOwner && erc.value) {
        nft.inType = "offer";
        nft.inValue = erc.value;
      }
      nfts.push(nft);
      nftMap[inKey] = true;
      nftMap[outKey] = false;
    } else if (!nftMap[outKey]) {
      const index = nfts.findLastIndex(
        (n: any) =>
          n.type === "in" && n.contract === contract && n.tokenID === tokenID
      );
      const nft = nfts[index];
      nft.type = "out";
      nft.outhash = hash;
      const erc = balanceMap[hash] || {};

      if (erc.isOwner && erc.value) {
        nft.outType = "offer sell";
        nft.outValue = erc.value;
        nft.outGasPrice = erc.gasPrice;
        nft.outGasUsed = erc.gasUsed;
      } else if (!erc.isOwner && erc.value) {
        nft.outType = "sell";
        nft.outValue = erc.value;
      } else {
        nft.outGasPrice = erc.gasPrice;
        nft.outGasUsed = erc.gasUsed;
      }
      nfts[index] = nft;
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

export default flips;
