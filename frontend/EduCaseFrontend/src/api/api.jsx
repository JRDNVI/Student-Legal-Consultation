// https://axios-http.com/docs/config_defaults

// Reworked to use axios for API calls. It significantly simplifies the code.
// If their is a token it will attach it to the request header. Which will be used for authentication in the backend.


import axios from "axios";

const api = axios.create({
  baseURL: "https://8t5k8esi55.execute-api.eu-west-1.amazonaws.com/prod/", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
