import axios from "axios";

const API_BASE = "http://localhost:5209";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
