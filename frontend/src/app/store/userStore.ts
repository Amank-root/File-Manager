import { create } from 'zustand';
import { userService } from '../services/api';

export interface Address {
  id: number;
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  addresses: Address[];
}

interface UserState {
  profile: UserProfile | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  changePassword: (passwordData: any) => Promise<boolean>;
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: any) => Promise<void>;
  updateAddress: (id: number, addressData: any) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  clearErrors: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,
  
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getProfile();
      set({ 
        profile: response.data, 
        addresses: response.data.addresses,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to load profile' 
      });
    }
  },
  
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateProfile(userData);
      set({ 
        profile: response.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to update profile' 
      });
    }
  },
  
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      await userService.changePassword(passwordData);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.old_password?.[0] || 'Failed to change password' 
      });
      return false;
    }
  },
  
  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getAddresses();
      set({ 
        addresses: response.data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to load addresses' 
      });
    }
  },
  
  addAddress: async (addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.addAddress(addressData);
      const addresses = [...get().addresses, response.data];
      set({ 
        addresses,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to add address' 
      });
    }
  },
  
  updateAddress: async (id, addressData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateAddress(id, addressData);
      const addresses = get().addresses.map(addr => 
        addr.id === id ? response.data : addr
      );
      set({ 
        addresses,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to update address' 
      });
    }
  },
  
  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteAddress(id);
      const addresses = get().addresses.filter(addr => addr.id !== id);
      set({ 
        addresses,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to delete address' 
      });
    }
  },
  
  clearErrors: () => {
    set({ error: null });
  }
}));

export default useUserStore; 