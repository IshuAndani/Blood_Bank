import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
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
