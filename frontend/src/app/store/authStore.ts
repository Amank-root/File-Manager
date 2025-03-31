import { create } from 'zustand';
import { authService } from '../services/api';
import { AxiosResponse } from 'axios';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<AxiosResponse<any, any> | void>;
  logout: () => void;
  clearErrors: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);
      set({ 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error("Login error:", error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
      });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Registration data in store:", userData);
      const response = await authService.register(userData);
      console.log("Registration response:", response);
      set({ isLoading: false, error: null });
      return response;
    } catch (error: any) {
      console.error("Registration error in store:", error.response);
      
      // Handle different types of error responses
      let errorMessage = 'Registration failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle field-specific errors (Django REST framework format)
        if (typeof errorData === 'object') {
          const firstErrorField = Object.keys(errorData)[0];
          if (firstErrorField && Array.isArray(errorData[firstErrorField])) {
            errorMessage = `${firstErrorField}: ${errorData[firstErrorField][0]}`;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors[0];
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      
      throw error; // Re-throw to handle in the component
    }
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  clearErrors: () => {
    set({ error: null });
  },
  
  checkAuth: () => {
    const isAuthenticated = authService.isAuthenticated();
    set({ isAuthenticated });
  }
}));

export default useAuthStore; 