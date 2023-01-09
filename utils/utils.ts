import { isPlainObject, slice } from "lodash";
import ethers from "ethers";

/**
 * 删除含有 null 或者 undefined 的字段
 * @param data 要检测的数据
 */
export function deleteNullOrUndefinedField(data: any = {}) {
  return Object.keys(data).reduce((pre: any, key: string) => {
    let item = data[key];
    if (isPlainObject(item)) {
      item = deleteNullOrUndefinedField(item);
    }
    if (item || item === false || item === 0) {
      pre[key] = item; // eslint-disable-line no-param-reassign
    }
    return pre;
  }, {});
}

export const isAddress = (address: string = "") =>
  ethers.utils.isAddress(address);

export const isServer = () => typeof window === "undefined";

export const sleep = (delay: number = 300) =>
  new Promise((resolve, reject) => setTimeout(() => resolve, delay));

export const hideStr = (str: string, len = 4) =>
  str.slice(0, 4) + "..." + str.slice(str.length - len);
