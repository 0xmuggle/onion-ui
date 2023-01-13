import { openDB } from "idb";
import { isEmpty } from "lodash";
import { DB, defaultAccount } from "./idb.d";

// 打开
const open = async () => {
  const db = await openDB<DB>("onion", 1, {
    upgrade(db) {
      const storeNames = db.objectStoreNames;
      if (!storeNames.contains("account")) {
        // account
        const account = db.createObjectStore("account", {
          keyPath: "id",
          autoIncrement: true,
        });
        account.createIndex("address", "address", { unique: true });
      }

      // nft
      if (!storeNames.contains("nfts721")) {
        const nfts721db = db.createObjectStore("nfts721", {
          keyPath: "id",
          autoIncrement: true,
        });
        nfts721db.createIndex("address", "address", { unique: false });
      }

      // erc20
      if (!storeNames.contains("erc20s")) {
        const erc20db = db.createObjectStore("erc20s", {
          keyPath: "id",
          autoIncrement: true,
        });
        erc20db.createIndex("address", "address", { unique: false });
      }

      // intxs
      if (!storeNames.contains("intxs")) {
        const intxsdb = db.createObjectStore("intxs", {
          keyPath: "id",
          autoIncrement: true,
        });
        intxsdb.createIndex("address", "address", { unique: false });
      }

      // tsx
      if (!storeNames.contains("txs")) {
        const tsxdb = db.createObjectStore("txs", {
          keyPath: "id",
          autoIncrement: true,
        });
        tsxdb.createIndex("address", "address", { unique: false });
      }

      // favourite address
      if (!storeNames.contains("favourites")) {
        const tsxdb = db.createObjectStore("favourites", {
          keyPath: "id",
          autoIncrement: true,
        });
        tsxdb.createIndex("address", "address", { unique: false });
      }

      // 我的地址列表 address
      if (!storeNames.contains("profile")) {
        const tsxdb = db.createObjectStore("profile", {
          keyPath: "id",
          autoIncrement: true,
        });
        tsxdb.createIndex("address", "address", { unique: false });
      }
    },
  });
  return db;
};
// 查询
const getIndexOne = async (dbName: any, address: any) => {
  const db = await open();
  const store = await db.transaction([dbName]).objectStore(dbName);
  return await store.index("address" as never).get(address);
};
// 更新
export const updateOne = async (dbName: any, item: any) => {
  try {
    const db = await open();
    await db.transaction([dbName], "readwrite").objectStore(dbName).put(item);
    return true;
  } catch (e) {
    return false;
  }
};
// 创建
const createOne = async (dbName: any, item: any) => {
  const db = await open();
  const index = await db
    .transaction([dbName], "readwrite")
    .objectStore(dbName)
    .add(item);
  return await db.transaction([dbName]).objectStore(dbName).get(index);
};
// 创建多个
const createMany = async (dbName: any, address: string, list: any) => {
  if (list.length === 0) return [];
  const db = await open();
  const store = db.transaction([dbName], "readwrite").objectStore(dbName);
  await Promise.all(
    list.map((item: any) =>
      store.add({
        ...item,
        address,
      })
    )
  );
};
// 查询所有
const readAll = async (dbName: any, address: any) => {
  try {
    const db = await open();
    const store = db.transaction(dbName).objectStore(dbName);
    const txs = await store.index("address" as never).getAll(address);
    return txs;
  } catch {
    return [];
  }
};
// 查询用户
export const getAccount = async (address: string) => {
  try {
    const account = await getIndexOne("account", address);
    if (isEmpty(account)) {
      return await createOne("account", {
        address,
        ...defaultAccount,
      });
    }
    return account;
  } catch (e) {
    return {
      address,
      ...defaultAccount,
    };
  }
};

// 更新用户
export const putAccount = (item: any) => {
  return updateOne("account", item);
};

// 创建NFT
export const createNfts721 = (address: string, list: any) => {
  return createMany("nfts721", address, list);
};

// 查询NFT
export const queryNfts721 = (address: string) => {
  return readAll("nfts721", address);
};

// 查询普通交易
export const queryTxs = (address: string) => {
  return readAll("txs", address);
};

// 创建普通交易
export const createTxs = (address: string, list: any) => {
  return createMany("txs", address, list);
};

// 查询内部交易
export const queryInTxs = (address: string) => {
  return readAll("intxs", address);
};

// 创建内部交易
export const createInTxs = (address: string, list: any) => {
  return createMany("intxs", address, list);
};

// 查询ERC20交易
export const queryErc20s = (address: string) => {
  return readAll("erc20s", address);
};

// 创建内部交易
export const createErc20s = (address: string, list: any) => {
  return createMany("erc20s", address, list);
};

// 查询收藏地址
export const queryFavourites = (address: string) => {
  return readAll("favourites", address);
};
