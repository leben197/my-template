declare interface Window {
  // 扩展window对象
}

// 分页请求参数
declare interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

// 分页响应数据
declare interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  [key: string]: any;
}

// 通用接口响应格式
declare interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
