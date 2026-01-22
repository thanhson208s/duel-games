export class StorageUtils {
  static getInt(key: string, value = 0): number {
    const data = localStorage.getItem(key);
    if (data != null) {
      let ret = parseInt(data);
      return isNaN(ret) ? value : ret;
    } else return value;
  }

  static setInt(key: string, value: number) {
    localStorage.setItem(key, value.toString());
  }

  static getFloat(key: string, value = 0): number {
    const data = localStorage.getItem(key);
    if (data != null) {
      let ret = parseFloat(data);
      return isNaN(ret) ? value : ret;
    } else return value;
  }

  static setFloat(key: string, value: number) {
    localStorage.setItem(key, value.toString());
  }

  static getBool(key: string, value = false): boolean {
    const data = localStorage.getItem(key);
    if (data != null) {
      return Boolean(parseInt(data));
    } else return value;
  }

  static setBool(key: string, value: boolean) {
    localStorage.setItem(key, value ? "1" : "0");
  }

  static getString(key: string, value = ""): string {
    let data = localStorage.getItem(key);
    if (data != null) return data;
    else return value;
  }

  static setString(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static getObject<T>(key: string, value: T | null = null): T | null {
    let data = localStorage.getItem(key);
    if (data != null) {
      try {
        return JSON.parse(data) as T;
      } catch(e) {
        console.error(`Parse error for local storage object:${key}`);
      }
    }
    return value;
  }

  static setObject<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}