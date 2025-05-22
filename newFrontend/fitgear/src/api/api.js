import axios from "axios";

const API_BASE = "http://localhost:5209";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// export const refreshAccessToken = async (userId) => {
//   try {
//     const response = await api.post("/api/User/refreshtoken",
//       { userId }
//     );
//     console.log(response.data);
//     setAccessToken(response.data.title);
//     return response.data.title;
//   } catch (error) {
//     console.error("Refresh token failed:", error);
//     throw error;
//   }
// };