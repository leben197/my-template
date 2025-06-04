import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 默认配置
const DEFAULT_CONFIG = {
  timeout: 10000,
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
};

// 响应结构体类型
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

class HttpRequest {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里添加token等信息
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const { data } = response;
        // 根据业务状态码判断请求是否成功
        if (data.code === 0 || data.code === 200) {
          return data;
        }
        // 统一处理业务错误
        return Promise.reject(new Error(data.message || "请求失败"));
      },
      (error) => {
        // 统一处理HTTP错误
        let message = "网络错误";
        if (error.response) {
          switch (error.response.status) {
            case 401:
              message = "未授权，请登录";
              // 可以在这里处理登录过期逻辑
              break;
            case 403:
              message = "拒绝访问";
              break;
            case 404:
              message = "请求地址错误";
              break;
            case 500:
              message = "服务器错误";
              break;
            default:
              message = `请求失败 (${error.response.status})`;
              break;
          }
        }
        return Promise.reject(new Error(message));
      }
    );
  }

  public request<T = any>(
    config: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.delete(url, config);
  }
}

export const http = new HttpRequest(DEFAULT_CONFIG);
export default http;
