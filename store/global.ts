import { Rekv } from "./rekv";

interface GlobalStore {
  locale: string;
  userInfo: {
    // 用户信息
    isLogin: boolean;
    address: string;
  };
}

const initState: GlobalStore = {
  locale: "en",
  userInfo: {
    isLogin: false,
    address: "",
  },
};

/**
 * 用户状态存储
 */
const globalStore = new Rekv({
  initState,
  effects: {},
});

export default globalStore;
