"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaFileAlt, FaFilePdf, FaFileExcel, FaFileWord, FaFile } from 'react-icons/fa';
import useAuthStore from '@/app/store/authStore';
import useFileStore from '@/app/store/fileStore';

const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { dashboard, isLoading, error, loadDashboard, clearErrors } = useFileStore();
  
  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, checkAuth]);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated, loadDashboard]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);
  
  // Function to get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'excel':
        return <FaFileExcel className="text-green-600 text-4xl" />;
      case 'word':
        return <FaFileWord className="text-blue-600 text-4xl" />;
      case 'text':
        return <FaFileAlt className="text-gray-600 text-4xl" />;
      default:
        return <FaFile className="text-gray-400 text-4xl" />;
    }
  };
  
  // Calculate the percentage of each file type
  const calculatePercentage = (count: number) => {
    if (!dashboard || dashboard.total_files === 0) return 0;
    return Math.round((count / dashboard.total_files) * 100);
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className='text-black'>
      <h1 className="text-2xl font-bold mb-6 text-white">Your Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Files Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Total Files</h2>
            <div className="flex items-center justify-center gap-4">
              <FaFileAlt className="text-primary-500 text-5xl" />
              <span className="text-4xl font-bold">{dashboard.total_files}</span>
            </div>
          </div>
          
          {/* File Type Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">File Types</h2>
            {dashboard.total_files === 0 ? (
              <p className="text-center text-gray-500">No files uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(dashboard.file_type_breakdown).map(([fileType, count]) => (
                  <div key={fileType} className="flex items-center gap-3">
                    {getFileTypeIcon(fileType)}
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{fileType}</span>
                        <span className="text-gray-600 text-sm">{count} files ({calculatePercentage(count)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${calculatePercentage(count)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/files')}
                className="p-4 cursor-pointer bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
              >
                <FaFileAlt className="text-primary-600 text-2xl mx-auto mb-2" />
                <span className="block font-medium">View Your Files</span>
              </button>
              <button
                onClick={() => router.push('/files?upload=true')}
                className="p-4 cursor-pointer bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
              >
                <FaFileAlt className="text-primary-600 text-2xl mx-auto mb-2" />
                <span className="block font-medium">Upload New Files</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-gray-500">No data available. Try refreshing the page.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 