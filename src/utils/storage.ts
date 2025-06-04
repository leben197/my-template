/**
 * 封装localStorage和sessionStorage，支持设置过期时间
 */
interface StorageData<T> {
  value: T;
  expire: number | null; // 过期时间戳
}

class Storage {
  private prefix: string;
  private storage: globalThis.Storage;

  constructor(prefix: string = "", storage: globalThis.Storage = localStorage) {
    this.prefix = prefix;
    this.storage = storage;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置数据
   * @param key 键
   * @param value 值
   * @param expire 过期时间(ms)，不传则永不过期
   */
  set<T>(key: string, value: T, expire: number | null = null): void {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? Date.now() + expire : null,
    });
    this.storage.setItem(this.getKey(key), stringData);
  }

  /**
   * 获取数据
   * @param key 键
   * @param defaultVal 默认值
   * @returns 值或默认值
   */
  get<T>(key: string, defaultVal: T | null = null): T | null {
    const item = this.storage.getItem(this.getKey(key));
    if (item !== null) {
      try {
        const data: StorageData<T> = JSON.parse(item);
        const { value, expire } = data;
        // 未过期或者没有设置过期时间
        if (expire === null || expire > Date.now()) {
          return value;
        }
        // 已过期，删除
        this.remove(key);
      } catch (error) {
        return defaultVal;
      }
    }
    return defaultVal;
  }

  /**
   * 移除数据
   * @param key 键
   */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    this.storage.clear();
  }
}

export const localStorage = new Storage("app_");
export const sessionStorage = new Storage("app_", window.sessionStorage);
