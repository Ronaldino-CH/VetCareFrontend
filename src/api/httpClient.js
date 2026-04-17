import axios from "axios";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "../utils/constants";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

httpClient.interceptors.request.use((config) => {
  const authRaw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!authRaw) return config;

  try {
    const auth = JSON.parse(authRaw);
    const token = auth?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return config;
});

export default httpClient;
