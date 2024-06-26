import api, {client} from '@/api';
import store from "@/store";
import { hasError } from "@/utils";

const login = async (token: string): Promise <any> => {
  const url = store.getters["user/getBaseUrl"]
  const baseURL = url.startsWith('http') ? url.includes('/rest/s1/available-to-promise') ? url : `${url}/rest/s1/available-to-promise/` : `https://${url}.hotwax.io/rest/s1/available-to-promise/`;
  let api_key = ""

  try {
    const resp = await client({
      url: "login", 
      method: "post",
      baseURL,
      params: {
        token
      },
      headers: {
        "Content-Type": "application/json"
      }
    }) as any;

    if(!hasError(resp) && (resp.data.api_key || resp.data.token)) {
      api_key = resp.data.api_key || resp.data.token
    } else {
      throw "Sorry, login failed. Please try again";
    }
  } catch(err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }
  return Promise.resolve(api_key)
}

const getUserProfile = async (token: any): Promise<any> => {
  const url = store.getters["user/getBaseUrl"];
  const baseURL = url.startsWith('http') ? url.includes('/rest/s1/available-to-promise') ? url : `${url}/rest/s1/available-to-promise/` : `https://${url}.hotwax.io/rest/s1/available-to-promise/`;
  try {
    const resp = await client({
      url: "user/profile",
      method: "GET",
      baseURL,
      headers: {
        "api_key": token,
        "Content-Type": "application/json"
      }
    });
    if(hasError(resp)) throw "Error getting user profile";
    return Promise.resolve(resp.data)
  } catch(error: any) {
    return Promise.reject(error)
  }
}

const getAvailableTimeZones = async (): Promise <any>  => {
  return api({
    url: "user/getAvailableTimeZones",
    method: "get",
    cache: true
  });
}

const setUserTimeZone = async (payload: any): Promise <any>  => {
  return api({
    url: "setUserTimeZone",
    method: "post",
    data: payload
  });
}

const getEComStores = async (token: any): Promise<any> => {
  try {
    const url = store.getters["user/getBaseUrl"];
    const baseURL = url.startsWith('http') ? url.includes('/rest/s1/available-to-promise') ? url : `${url}/rest/s1/available-to-promise/` : `https://${url}.hotwax.io/rest/s1/available-to-promise/`;
    const resp = await client({
      url: "user/productStore",
      method: "GET",
      baseURL,
      headers: {
        "api_key": token,
        "Content-Type": "application/json"
      }
    });
    // Disallow login if the user is not associated with any product store
    if (hasError(resp) || resp.data.length === 0) {
      throw resp.data;
    } else {
      return Promise.resolve(resp.data);
    }
  } catch(error: any) {
    return Promise.reject(error)
  }
}

export const UserService = {
  getAvailableTimeZones,
  getEComStores,
  getUserProfile,
  login,
  setUserTimeZone
}