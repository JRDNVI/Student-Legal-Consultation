// https://axios-http.com/docs/config_defaults

// Reworked to use axios for API calls. It significantly simplifies the code.
// If their is a token it will attach it to the request header. Which will be used for authentication in the backend.


import axios from "axios";

export const authApi = axios.create({
  baseURL: "https://d2wk9ecws2.execute-api.eu-west-1.amazonaws.com/prod/",
});

export const appApi = axios.create({
  baseURL: "https://pzfd8uck8f.execute-api.eu-west-1.amazonaws.com/dev/",
});

appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
