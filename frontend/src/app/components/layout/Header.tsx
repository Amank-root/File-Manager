"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMdLogOut, IoMdPerson } from 'react-icons/io';
import { HiDocumentAdd } from 'react-icons/hi';
import { BiSolidDashboard } from 'react-icons/bi';
import useAuthStore from '@/app/store/authStore';

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            FilePortal
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/dashboard" 
                      className={`flex items-center gap-1 hover:text-primary-200 transition-colors ${pathname === '/dashboard' ? 'text-primary-200 font-medium' : ''}`}
                    >
                      <BiSolidDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/files" 
                      className={`flex items-center gap-1 hover:text-primary-200 transition-colors ${pathname === '/files' ? 'text-primary-200 font-medium' : ''}`}
                    >
                      <HiDocumentAdd />
                      <span>Files</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/profile" 
                      className={`flex items-center gap-1 hover:text-primary-200 transition-colors ${pathname === '/profile' ? 'text-primary-200 font-medium' : ''}`}
                    >
                      <IoMdPerson />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className="flex items-center gap-1 hover:text-primary-200 transition-colors"
                    >
                      <IoMdLogOut />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className={`hover:text-primary-200 transition-colors ${pathname === '/login' ? 'text-primary-200 font-medium' : ''}`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/register" 
                      className={`hover:text-primary-200 transition-colors ${pathname === '/register' ? 'text-primary-200 font-medium' : ''}`}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 