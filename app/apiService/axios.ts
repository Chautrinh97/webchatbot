import axios, { AxiosInstance } from 'axios';
const axiosInstance: AxiosInstance = axios.create({
   baseURL: process.env.API_ENDPOINT,
   transformRequest: [],
   headers: {
      Accept: '*/*',
      "Content-Type": 'application/json',
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
   },
});

axiosInstance.interceptors.request.use(
   config => {
      config.headers['timestamp'] = new Date().toISOString();
      return config;
   },
   error => {
      return Promise.reject(error);
   }
);

axiosInstance.interceptors.response.use(
   response => response,
   error => {
      if (error.response) {
         return Promise.resolve(error.response);
      }
      return Promise.reject(error);
   }
);

export default axiosInstance;

