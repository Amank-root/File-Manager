"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaFilePdf, 
  FaFileExcel, 
  FaFileWord, 
  FaFileAlt, 
  FaFile 
} from 'react-icons/fa';
import useAuthStore from '@/app/store/authStore';
import useFileStore from '@/app/store/fileStore';
import Button from '@/app/components/ui/Button';

const FilesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { 
    files, 
    isLoading, 
    error, 
    loadFiles, 
    uploadFile, 
    deleteFile, 
    downloadFile, 
    clearErrors 
  } = useFileStore();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, checkAuth]);
  
  // Load files when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated, loadFiles]);
  
  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);
  
  // Check for upload query parameter
  useEffect(() => {
    if (searchParams.get('upload') === 'true') {
      setShowUploadModal(true);
    }
  }, [searchParams]);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      await uploadFile(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      toast.success('File uploaded successfully');
      setSelectedFile(null);
      setShowUploadModal(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed', err);
      // Error will be handled by the store
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteFile = async (id: number, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await deleteFile(id);
        toast.success('File deleted successfully');
      } catch (err) {
        // Error will be handled by the store
      }
    }
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-xl" />;
      case 'excel':
        return <FaFileExcel className="text-green-600 text-xl" />;
      case 'word':
        return <FaFileWord className="text-blue-600 text-xl" />;
      case 'text':
        return <FaFileAlt className="text-gray-600 text-xl" />;
      default:
        return <FaFile className="text-gray-400 text-xl" />;
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Files</h1>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2"
        >
          <FaUpload />
          Upload File
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : files.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(file.file_type)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{file.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.file_type_display}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.file_size_display}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(file.upload_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={async () => {
                        try {
                          await downloadFile(file.id);
                        } catch (err) {
                          // Error will be handled by the store
                        }
                      }}
                      className="text-black cursor-pointer hover:text-primary-900 mr-4"
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id, file.filename)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No files yet</h3>
          <p className="text-gray-500 mb-4">Upload your first file to get started</p>
          <Button onClick={() => setShowUploadModal(true)}>
            Upload File
          </Button>
        </div>
      )}
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            
            <div className="mb-4 cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  focus:outline-none"
                ref={fileInputRef}
              />
            </div>
            
            {selectedFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
            
            {isUploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">{uploadProgress}%</p>
              </div>
            )}
            
            <div className="flex text-black justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={!selectedFile || isUploading}
                className={`!text-black ${!selectedFile || !isUploading && "cursor-pointer"}`}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesPage; 