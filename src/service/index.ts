import { RequestInfo } from "undici-types";
import { getServiceBaseURL } from "./request";

import message from "@/components/message";

// 指定Content-Type的格式，application/json
const headers = {
  'Content-Type': 'application/json;charset=utf-8'
};
const { baseURL } = getServiceBaseURL(import.meta.env);
function timeout(delay: number | undefined) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      //
      reject(new Error('timeout'));
    }, delay);
  });
}
// 创建请求方法
function fetchRequest(url: RequestInfo, options: RequestInit | undefined, config: any) {
  let newBaseURL = getServiceBaseURL(import.meta.env).baseURL;
  if (config.baseUrl) {
    newBaseURL = config.baseUrl;
  }
  const newUrl = `${newBaseURL}${url}`;

  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutPromise = timeout(10000); // 设置超时时间为 10 秒，可以根据需要调整
  const fetchPromise = fetch(newUrl, { ...options, signal });
  return Promise.race([fetchPromise, timeoutPromise]).then((response: any) => {
    if (!response.ok) {
      throw new Error('request failed');
    }
    return responseInterceptor(response);
  })
    .catch(error => {
      if (error.message === 'timeout') {
        console.warn('Timeout occurred');
        message({ str: "Timeout occurred", type: "error" });
        // 显示超时提示
      } else {
        console.error('Other error occurred', error);
      }
    });
  // return fetch(newUrl, options)
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('请求失败');
  //     }
  //     return responseInterceptor(response);
  //   })
  //   .then(result => {
  //     return result;
  //   })
  //   .catch(error => {
  //     console.error('请求出错:', error);
  //   });
}
//创建响应拦截器
function responseInterceptor(response: Response) {
  return response.json().then(data => {
    if (data.code !== 0) {
      message({ str: data.msg, type: "error" });
    }
    return data;
  });
}


// 创建请求拦截器
function requestInterceptor(config: any) {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  // if (token) {
  if (!config.headers) {
    config.headers = {};
  }
  // config.headers['Authenticate'] = `testlogin`;
  config.headers['Authenticate'] = `${token}`;
  if (config.method === "GET" && config.params) {
    let url = config.url + "?" + new URLSearchParams(config.params).toString();
    config.params = {};
    config.url = url;
  }
  return config;
}

// 创建一个新的 Fetch 请求方法
// 创建一个新的 Fetch 请求方法
export default function request(config: any) {
  // 创建请求拦截器
  if (config.interceptors && config.interceptors.requestInterceptor) {
    config = config.interceptors.requestInterceptor(config);
  } else {
    config = requestInterceptor(config);
  }
  const { method, headers } = config
  const fetchOptions: RequestInit = {
    method,
    headers
  };

  if (config.method && !['GET', 'HEAD'].includes(config.method)) {
    fetchOptions.body = JSON.stringify(config.data);
  }

  // 发起请求
  return fetchRequest(config.url, fetchOptions, config)
    .then(response => {
      // 返回结果
      return response;
    })
    .catch(error => {
      console.error('请求出错:', error);
    });
}
