import message from "@/components/message";
import { RequestInfo } from "undici-types";
import { getServiceBaseURL } from "./request";
// 在文件顶部添加类型定义
interface RequestConfig {
  url: string;
  method: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, any>;
  baseUrl?: string;
  interceptors?: {
    requestInterceptor?: (config: RequestConfig) => RequestConfig;
    responseInterceptor?: (response: any) => any;
  };
}

interface ResponseData<T = any> {
  code: number;
  msg: string;
  data: T;
}
const { baseURL } = getServiceBaseURL(import.meta.env);
function timeout(delay: number | undefined) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      //
      reject(new Error("timeout"));
    }, delay);
  });
}
// 创建请求方法
function fetchRequest(
  url: RequestInfo,
  options: RequestInit | undefined,
  config: RequestConfig // 修改为具体类型而不是any
) {
  let newBaseURL = baseURL;
  if (config.baseUrl) {
    newBaseURL = config.baseUrl;
  }
  const newUrl = `${newBaseURL}${url}`;

  // 移除这里的AbortController创建，使用传入的options中的signal
  const timeoutPromise = timeout(10000); // 设置超时时间为 10 秒
  const fetchPromise = fetch(newUrl, options); // 直接使用传入的options

  return Promise.race([fetchPromise, timeoutPromise])
    .then((response: any) => {
      console.log("response", response);

      if (!response.ok || response.status !== 200) {
        // 处理非 2xx 的响应状态码
        if (response.status === 401) {
          message({ str: "未授权，请登录", type: "error" });
          localStorage.removeItem("token");
        }
        throw new Error("request failed");
      }
      return responseInterceptor(response);
    })
    .catch((error) => {
      console.log("error", error);

      if (error.message === "timeout") {
        console.warn("Timeout occurred");
        message({ str: "Timeout occurred", type: "error" });
      } else {
        console.error("Other error occurred", error);
        message({ str: "请求失败", type: "error" });
      }
      // 返回统一错误格式
      return { code: -1, msg: error.message || "请求失败", data: null };
    });
}
//创建响应拦截器
function responseInterceptor(response: Response) {
  const contentType = response.headers.get("content-type");

  // 根据内容类型处理响应
  if (contentType && contentType.includes("application/json")) {
    return response.json().then((data) => {
      if (data.code !== 0) {
        message({ str: data.msg || "请求失败", type: "error" });
      }
      return data;
    });
  } else if (contentType && contentType.includes("text/")) {
    return response.text().then((text) => ({
      code: 0,
      data: text,
      msg: "success",
    }));
  } else {
    return response.blob().then((blob) => ({
      code: 0,
      data: blob,
      msg: "success",
    }));
  }
}

// 创建请求拦截器
function requestInterceptor(config: RequestConfig): RequestConfig {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || localStorage.getItem("token");

  if (!config.headers) {
    config.headers = {};
  }

  // 添加公共头部
  config.headers["X-Mse-Flag"] = 1;

  // 只有当 token 存在时才添加到请求头
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["x-token"] = token;
  }

  if (config.method === "GET" && config.params) {
    let url = config.url + "?" + new URLSearchParams(config.params).toString();
    config.params = {};
    config.url = url;
  }
  return config;
}

<<<<<<< HEAD
// 创建一个请求管理器
const requestManager = new Map();

// 修改request函数
export default function request<T = any>(
  config: RequestConfig
): Promise<ResponseData<T>> {
  const controller = new AbortController();
  const signal = controller.signal;

  // 请求拦截器逻辑保持不变
=======
// 创建一个新的 Fetch 请求方法
export default function request(config: any) {
  // 创建请求拦截器
>>>>>>> 77b736a (普通模板)
  if (config.interceptors && config.interceptors.requestInterceptor) {
    config = config.interceptors.requestInterceptor(config);
  } else {
    config = requestInterceptor(config);
  }

  const { method, headers } = config;
  const fetchOptions: RequestInit = {
    method,
    headers,
    signal,
  };

  if (config.method && !["GET", "HEAD"].includes(config.method)) {
    fetchOptions.body = JSON.stringify(config.data);
  }

  // 发起请求
  const promise = fetchRequest(config.url, fetchOptions, config);

  // 将请求保存到管理器中
  requestManager.set(promise, controller);

  // 请求完成后从管理器中移除
  promise.finally(() => {
    requestManager.delete(promise);
  });

  return promise;
}

// 提供取消请求的工具函数
export function cancelRequest(promiseToCancel: Promise<any>): boolean {
  const controller = requestManager.get(promiseToCancel);
  if (controller) {
    controller.abort();
    requestManager.delete(promiseToCancel);
    return true;
  }
  return false;
}
