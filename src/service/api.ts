
import request from '@/service/index';
import md5 from "@/utils/md5";
export function generateSignature(obj: Record<string, any> | null, secret = 'ikkP9w0KfVz1tnvHCin49e6XZUwd94qZ'): { sign: string; timestamp: number } {
  let sortedParams: Record<string, any> = {};
  if (obj) {
    // 先添加 timestamp 属性
    const now = Math.floor(Date.now() / 1000);
    obj.timestamp = now;

    // 获取obj的键并与timestamp组成新的键数组，然后进行排序
    const keys = Object.keys(obj);
    const sortedKeys = keys.sort((a: string, b: string) => a.localeCompare(b));

    // 按照排序后的键填充sortedParams对象
    for (const key of sortedKeys) {
      sortedParams[key] = obj[key] === undefined || obj[key] === null ? '' : obj[key];
    }
  } else {
    // 如果obj为空，创建一个包含timestamp的新对象
    sortedParams = { timestamp: Math.floor(Date.now() / 1000) };
  }

  let paramString = '';
  for (const key in sortedParams) {
    if (Array.isArray(sortedParams[key])) {
      paramString += `${key}=${JSON.stringify(sortedParams[key])}`;
    } else {
      paramString += `${key}=${sortedParams[key]}`;
    }
  }
  const toBeHashed = paramString + secret;

  return { sign: md5(toBeHashed), timestamp: sortedParams.timestamp };
}

export const getReport = (param: any = {}) => {
  const { sign, timestamp } = generateSignature(param);
  return request({ url: `/v1/report2024`, method: 'GET', params: { ...param, sign, timestamp } });
};

export const getShare = (param: any = {}) => {
  const { sign, timestamp } = generateSignature(param);
  return request({ url: `/v1/report2024/share`, method: 'GET', params: { ...param, sign, timestamp } });
};
export const getSignatureQuery = (param: any = {}) => {
  return request({
    baseUrl: 'https://10thwx.sanguosha.com',
    url: `/wechat/jssdk`,
    method: 'GET', param
  });
}
