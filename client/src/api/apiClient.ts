import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request to:', config.url, 'Cookies will be sent automatically');
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.log('401 - Redirecting to login');
      window.location.href = "/";
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
