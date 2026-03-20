import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    console.error(error);
    return Promise.reject(error);
  }
);

export default apiClient;
