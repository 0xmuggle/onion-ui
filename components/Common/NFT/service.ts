import axios from "axios";
import { defaultRpcUri } from "common/constant";
import { get, isEmpty } from "lodash";
import Web3 from "web3";
import abi from "./abi.json";

const CACHE_NFT_METADATA = "CACHE_NFT_METADATA";

const instance = new Web3(defaultRpcUri);

const parseIPFS = (uri: string) =>
  (uri || "").replace("ipfs://", "https://gateway.ipfs.io/ipfs/");

const getUri = async (uri: string) => {
  try {
    const { data } = await axios.get(uri);
    return data.image;
  } catch {
    const { data } = await axios.get("/api/nft", {
      params: { url: encodeURI(uri) },
      timeout: 100000,
    });
    return data || "";
  }
};

export const getById = async (
  contractAddress: string,
  tokenId: string,
  tokenType: string
) => {
  const cacheMap: any = JSON.parse(
    localStorage.getItem(CACHE_NFT_METADATA) || "[]"
  );
  let token =
    cacheMap.find((item: any) => item.id === `${contractAddress}-${tokenId}`) ||
    {};

  if (isEmpty(token)) {
    try {
      const contract = new instance.eth.Contract(abi as any, contractAddress);
      let uri;
      if (tokenType === "1155") {
        uri = await contract.methods.uri(tokenId).call();
      } else {
        uri = await contract.methods.tokenURI(tokenId).call();
      }
      token.id = `${contractAddress}-${tokenId}`;
      token.uri = uri;
      token.imageUrl = await getUri(parseIPFS(uri));
    } catch (e) {
      console.log(">> e", e);
    }
  } else if (!token.imageUrl) {
    token.imageUrl = await getUri(parseIPFS(token.uri));
  }
  // 保存
  if (token.imageUrl || token.uri) {
    try {
      const lastest: any = JSON.parse(
        localStorage.getItem(CACHE_NFT_METADATA) || "[]"
      );
      localStorage.setItem(
        CACHE_NFT_METADATA,
        JSON.stringify([token, ...lastest].slice(0, 100))
      );
    } catch {
      localStorage.removeItem(CACHE_NFT_METADATA);
    }
  }
  return parseIPFS(token?.imageUrl);
};
