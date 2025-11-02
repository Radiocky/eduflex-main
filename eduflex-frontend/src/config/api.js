// src/config/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Use environment variable or fallback to localhost backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // ensures no CORS cookie issues
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: Attach token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle global API errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized – token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        toast.error('Session expired. Please log in again.');
        setTimeout(() => (window.location.href = '/'), 1500);
      } else {
        // Show server error message if available
        const message = data?.message || data?.error || 'An API error occurred';
        toast.error(message);
        console.error('API Error:', data);
      }
    } else if (error.request) {
      // Network or no response from backend
      toast.error('Network error. Please check your connection.');
      console.error('Network Error:', error.request);
    } else {
      // Unknown JS error
      toast.error('An unexpected error occurred.');
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
