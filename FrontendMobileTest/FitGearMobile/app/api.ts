import axios from "axios";
import { refreshToken } from "./context/AuthContext";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    console.log("[Axios Interceptor] 401 detected, attempting to refresh token...");
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          console.log("[Axios Interceptor] Retrying request with new token from queue");
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      console.log("[Axios Interceptor] Calling refreshToken()...");
      const { accessToken } = await refreshToken();
      console.log("[Axios Interceptor] Received new accessToken:", accessToken);
      processQueue(null, accessToken);

      originalRequest.headers["Authorization"] = "Bearer " + accessToken;
      return axios(originalRequest);
    } catch (err) {
      console.log("[Axios Interceptor] Failed to refresh token.");
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
); 