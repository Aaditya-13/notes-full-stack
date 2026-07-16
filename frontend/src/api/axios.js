import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/users/login" &&
        currentPath !== "/users/register" &&
        currentPath !== "/"
      ) {
        window.location.href = "/users/login";
      }
    }
    return Promise.reject(error);
  }
);