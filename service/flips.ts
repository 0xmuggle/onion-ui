import axios from 'axios';
import { ethers } from "ethers";
import { get } from "lodash";

const zeroAddress = '0x0000000000000000000000000000000000000000';
const ETHERESCAN_API_KEY = 'ZTCEJ9279MFUH58P6ZAVRQTZ2FJAF5K15G';
const chainApi: any = {
  ether: 'https://api.etherscan.io/api',
};
const ERC20s = ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x0000000000a39bb272e79075ade125fd351887ac'];

const query = async (params = {}, chain = 'ether') => {
  const { data } = await axios.get(`${chainApi[chain]}`, {
    timeout: 60 * 1000,
    params: {
      offset: 10000,
      sort: 'asc',
      ...params,
      apiKey: ETHERESCAN_API_KEY,
    },
  });
  return data.result;
}

export const queryAll = async (params = {}, chain = 'ether') => {
  let flag = true;
  let page = 0;
  let list: any = [];
  do {
    page += 1;
    const data = await query({
      ...params,
      page,
    }, chain);
    flag = data.length === 10000;
    list = list.concat(data);
  } while (flag);
  return list;
}

const getItem = (key: string, defaultValue: any, json = false) => {
  const result = localStorage.getItem(key) || defaultValue;
  return json ? JSON.parse(result) : result;
};
const setItem = (key: string, value: any, json = false) => localStorage.setItem(key, json ? JSON.stringify(value) : value);

const queryNfts = async (address: string) => {
  // 查询721
  const nfts721 = await queryAll({ 
    address,
    module: 'account',
    action: 'tokennfttx',
    startblock: Number(getItem(`startblock-721-${address}`, 0)) + 1,
  });
  if(nfts721.length > 0) {
    setItem(`startblock-721-${address}`, nfts721[nfts721.length -1].blockNumber);
  }
  
  // 查询1155
  const nfts1155 = await query({ 
    address,
    module: 'account',
    action: 'token1155tx',
    startblock: Number(getItem(`startblock-1155-${address}`, 0)) + 1,
  });
  if(nfts1155.length > 0) {
    setItem(`startblock-1155-${address}`, nfts1155[nfts1155.length -1].blockNumber);
  }
  console.log('>> nfts1155', nfts1155);
  // const nftsArr = nfts721.concat(nfts1155).sort((prev: any, next: any) => prev.blockNumber - next.blockNumber);

  // 处理数据
  const nftMap: Record<string, boolean> = {};
  const nfts: any = [];
  nfts721.forEach((item: any) => {
    const { tokenID, contractAddress: contract, from } = item;
    const inKey = `${contract}-${tokenID}-in`;
    const outKey = `${contract}-${tokenID}-out`;
    if(!nftMap[inKey]) {
      const nft: any = {
        contract,
        tokenID,
        tokenName: item.tokenName,
        inHash: item.hash,
        type: 'in',
      }
      if(from === zeroAddress) {
        nft.inType = 'mint';
      }
      nfts.push(nft);
      nftMap[inKey] = true;
      nftMap[outKey] = false;
    } else if(!nftMap[outKey]) {
      const index = nfts.findLastIndex((n: any) => n.type === 'in' && n.contract === contract && n.tokenID === tokenID);
      const nft = nfts[index];
      nft.type = 'out';
      nft.outhash = item.hash;

      nfts[index] = nft;
      nftMap[inKey] = false;
      nftMap[outKey] = true;
    }
  });
  return nfts;
}

const queryERC20 = async (address: string) => {
  let erc: any = [];
  for(let i = 0; i < ERC20s.length; i++) {
    const contractaddress = ERC20s[i];
    const erc20 = await queryAll({ 
      address,
      contractaddress,
      module: 'account',
      action: 'tokentx',
      startblock: Number(getItem(`startblock-tokentx-${contractaddress}-${address}`, 0)) + 1,
    });
    if(erc20.length > 0) {
      setItem(`startblock-tokentx-${contractaddress}-${address}`, erc20[erc20.length -1].blockNumber);
    }
    erc = erc.concat(erc20);
  }
  return erc;
}

const flips = async (address: string) => {
  // const nfts = await queryNfts(address);
  // 查询ERC20
  const erc20 = await queryERC20(address);
  // console.log('>>> nfts', nfts);

  console.log('>>> erc20', erc20);

  return queryNfts(address);
}

export default flips;