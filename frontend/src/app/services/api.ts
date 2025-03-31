import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8000/api';

// Helper functions to get/set cookies that work in browser only
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
};

const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = name + '=; Max-Age=-99999999; path=/';
};

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add request interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token') || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getCookie('refresh_token') || localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });
        
        if (response.data.access) {
          // Store in both localStorage and cookies
          localStorage.setItem('access_token', response.data.access);
          setCookie('access_token', response.data.access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        removeCookie('access_token');
        removeCookie('refresh_token');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login/', { email, password });
    if (response.data.access) {
      // Store in both localStorage and cookies
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setCookie('access_token', response.data.access);
      setCookie('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    return api.post('/users/register/', userData);
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    removeCookie('access_token');
    removeCookie('refresh_token');
  },
  
  isAuthenticated: () => {
    const token = getCookie('access_token') || localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  
  getUser: () => {
    const token = getCookie('access_token') || localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
};

// User profile services
export const userService = {
  getProfile: async () => {
    return api.get('/users/profile/');
  },
  
  updateProfile: async (userData: any) => {
    return api.put('/users/profile/', userData);
  },
  
  changePassword: async (passwordData: any) => {
    return api.post('/users/change-password/', passwordData);
  },
  
  // Address endpoints
  getAddresses: async () => {
    return api.get('/users/addresses/');
  },
  
  addAddress: async (addressData: any) => {
    return api.post('/users/addresses/', addressData);
  },
  
  updateAddress: async (id: number, addressData: any) => {
    return api.put(`/users/addresses/${id}/`, addressData);
  },
  
  deleteAddress: async (id: number) => {
    return api.delete(`/users/addresses/${id}/`);
  }
};

// Files services
export const fileService = {
  uploadFile: async (fileData: FormData) => {
    return api.post('/files/upload/', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getFiles: async () => {
    return api.get('/files/list/');
  },
  
  deleteFile: async (id: number) => {
    return api.delete(`/files/delete/${id}/`);
  },
  
  downloadFile: async (id: number) => {
    const response = await api.get(`/files/download/${id}/`, {
      responseType: 'blob'
    });
    
    // Create a blob from the response data
    const blob = new Blob([response.data]);
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from Content-Disposition header or use a default
    const contentDisposition = response.headers;
    console.log(contentDisposition['content-type'].split("/")[1])
    let filename = `downloaded-file-${contentDisposition['content-length']}.${contentDisposition['content-type'].split("/")[1]}`;
    // if (contentDisposition) {
    //   filename=filename
    //   // const filenameMatch = contentDisposition.match(filename=);
    //   // if (filenameMatch) {
    //   //   filename = filenameMatch[1];
    //   // }
    // }
    
    link.setAttribute('download', filename);
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  },
  
  getDashboard: async () => {
    return api.get('/files/dashboard/');
  }
};

export default api; 