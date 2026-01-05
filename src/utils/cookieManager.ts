import { deleteCookie, setCookie, getCookie } from "cookies-next";

class CookieManager {
  static setCookie(key: string | undefined, value: string | undefined) {
    if (!key) {
      throw new Error("Unable to set cookie. <missing key>");
    }

    return setCookie(key, value);
  }

  static getCookie(key: string | undefined) {
    if (!key) {
      throw new Error("Unable to get cookie. <missing key>");
    }

    return getCookie(key);
  }

  static removeCookie(key: string | undefined) {
    if (!key) {
      throw new Error("Unable to get cookie. <missing key>");
    }

    return deleteCookie(key);
  }
}

export default CookieManager;
