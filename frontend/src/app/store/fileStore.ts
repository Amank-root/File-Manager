import { create } from 'zustand';
import { fileService } from '../services/api';

export interface File {
  id: number;
  filename: string;
  file: string;
  file_type: string;
  file_type_display: string;
  upload_date: string;
  size: number;
  file_size_display: string;
}

interface Dashboard {
  total_files: number;
  file_type_breakdown: Record<string, number>;
}

interface FileState {
  files: File[];
  dashboard: Dashboard | null;
  isLoading: boolean;
  error: string | null;
  loadFiles: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  uploadFile: (fileData: FormData) => Promise<void>;
  deleteFile: (id: number) => Promise<void>;
  downloadFile: (id: number) => Promise<void>;
  clearErrors: () => void;
}

const useFileStore = create<FileState>((set, get) => ({
  files: [],
  dashboard: null,
  isLoading: false,
  error: null,
  
  loadFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fileService.getFiles();
      set({ 
        files: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to load files' 
      });
    }
  },
  
  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fileService.getDashboard();
      set({ 
        dashboard: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to load dashboard' 
      });
    }
  },
  
  uploadFile: async (fileData) => {
    set({ isLoading: true, error: null });
    try {
      await fileService.uploadFile(fileData);
      // Reload files after upload
      await get().loadFiles();
      await get().loadDashboard();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to upload file' 
      });
    }
  },
  
  deleteFile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await fileService.deleteFile(id);
      // Remove file from state and update dashboard
      const files = get().files.filter(file => file.id !== id);
      set({ files, isLoading: false });
      await get().loadDashboard();
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to delete file' 
      });
    }
  },
  
  downloadFile: async (id) => {
    try {
      await fileService.downloadFile(id);
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to download file' 
      });
    }
  },
  
  clearErrors: () => {
    set({ error: null });
  }
}));

export default useFileStore; 