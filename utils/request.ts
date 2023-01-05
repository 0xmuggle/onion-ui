import axios from "axios";

import { deleteNullOrUndefinedField } from "./utils";

const instance: any = axios.create({
  withCredentials: true,
  timeoutErrorMessage: "error timeoutErrorMessage",
});

// request拦截器, 移除掉请求参数中值为 null 或者 undefined 的字段.
instance.interceptors.request.use(({ url, params, data, ...options }: any) => ({
  url,
  ...options,
  data: deleteNullOrUndefinedField(data),
  params: deleteNullOrUndefinedField(params),
}));

// 添加响应拦截器
instance.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    code: -1;
  }
);

export default instance;
