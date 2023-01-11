import { DBSchema } from "idb";

export interface DB extends DBSchema {
  account: {
    key: string;
    value: {
      address: string;
      // ens
      name: string;
      // nft721 查询block
      nft721Block: number;
      // 交易 查询block
      txsBlock: number;
      // erc20 block
      erc20Block: number;
      // 内部交易
      intxsBlock: number;
    };
    indexes: { address: string };
  };
  nfts721: {
    key: string;
    value: {
      address: string;
      blockNumber: string;
      contractAddress: string;
      from: string;
      gas: string;
      gasPrice: string;
      gasUsed: string;
      hash: string;
      timeStamp: string;
      to: string;
      tokenID: string;
      tokenName: string;
    };
    indexes: { address: string };
  };
  // 普通交易
  txs: {
    key: string;
    value: {
      address: string;
    };
    indexes: { address: string };
  };
  // 内敛交易
  intxs: {
    key: string;
    value: {
      address: string;
    };
    indexes: { address: string };
  };
  // ERC20交易
  erc20s: {
    key: string;
    value: {
      address: string;
    };
    indexes: { address: string };
  };
  // 我的地址列表
  profile: {
    key: string;
    value: {
      address: string;
      // 关联地址
      relate: string;
    };
    indexes: { address: string };
  };
  // 收藏的地址
  favourites: {
    key: string;
    value: {
      address: string;
    };
    indexes: { address: string };
  };
}

export const defaultAccount = {
  nft721Block: 0,
  txsBlock: 0,
  erc20Block: 0,
  intxsBlock: 0,
};
