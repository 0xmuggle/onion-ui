import axios from "axios";
import * as db from "service/flips/idb";
import { defaultAccount } from "./idb.d";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

const ETHERESCAN_API_KEY = "ZTCEJ9279MFUH58P6ZAVRQTZ2FJAF5K15G";

const chainApi: any = {
  ether: "https://api.etherscan.io/api",
};

const ERC20s = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x0000000000a39bb272e79075ade125fd351887ac",
];

//  ETHERESCAN
const query = async (params = {}, chain = "ether") => {
  const { data } = await axios.get(`${chainApi[chain]}`, {
    timeout: 300 * 1000,
    params: {
      offset: 10000,
      sort: "asc",
      ...params,
      apiKey: ETHERESCAN_API_KEY,
    },
  });
  return data.result || [];
};

export const queryAll = async (params = {}, chain = "ether") => {
  let flag = true;
  let list: any = [];
  let { startblock }: any = params;
  do {
    const data = await query(
      {
        ...params,
        startblock,
      },
      chain
    );
    flag = data.length === 10000;
    list = list.concat(data);
    if (flag) {
      startblock = Number(list[list.length - 1].blockNumber) + 1;
    }
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

// 查询缓存数据
export const queryCacheData = async (address: string) => {
  const [account, nfts721, txs, intxs, erc20] = await Promise.all([
    db.getAccount(address),
    db.queryNfts721(address),
    db.queryTxs(address),
    db.queryInTxs(address),
    db.queryErc20s(address),
  ]);
  return {
    account,
    nfts721,
    txs,
    intxs,
    erc20,
  };
};

export const queryData = async (address: string) => {
  // TODO cache
  // const {
  //   account: { nft721Block, txsBlock, intxsBlock, erc20Block, ...account },
  //   ...cache
  // } = await queryCacheData(address);
  const { nft721Block, txsBlock, intxsBlock, erc20Block } = defaultAccount;
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
  // await Promise.all([
  //   db.putAccount({
  //     ...account,
  //     nft721Block:
  //       nfts721.length > 0
  //         ? Number(nfts721[nfts721.length - 1].blockNumber)
  //         : nft721Block,
  //     txsBlock:
  //       txs.length > 0 ? Number(txs[txs.length - 1].blockNumber) : txsBlock,
  //     intxsBlock:
  //       intxs.length > 0
  //         ? Number(intxs[intxs.length - 1].blockNumber)
  //         : intxsBlock,
  //     erc20Block:
  //       erc20.length > 0
  //         ? Number(erc20[erc20.length - 1].blockNumber)
  //         : erc20Block,
  //   }),
  //   db.createNfts721(address, nfts721),
  //   db.createTxs(address, txs),
  //   db.createInTxs(address, intxs),
  //   db.createErc20s(address, intxs),
  // ]);
  return {
    erc20,
    nfts721,
    intxs,
    txs,
  };
};
