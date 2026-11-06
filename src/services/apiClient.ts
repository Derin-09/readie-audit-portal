import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    MyAuthorizationx: import.meta.env.VITE_MY_AUTHORIZATION,
    Authorization: `Basic ${import.meta.env.VITE_BASIC_AUTH}`,
  },
});