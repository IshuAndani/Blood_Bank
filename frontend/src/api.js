import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_API_URL,
  withCredentials: true,
  validateStatus : function(status){
    return status < 500;
  }
});

// Add interceptor to include Authorization header with token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; // Token already includes 'Bearer '
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
