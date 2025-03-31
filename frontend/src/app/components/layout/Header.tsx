"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMdLogOut, IoMdPerson } from 'react-icons/io';
import { HiDocumentAdd } from 'react-icons/hi';
import { BiSolidDashboard } from 'react-icons/bi';
import { RxCross1 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import useAuthStore from '@/app/store/authStore';

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const [mob, setMob] = useState(false)

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
            <ul className='flex sm:hidden'>
              <li onClick={() => setMob((val) => !val)}><GiHamburgerMenu /></li>
            </ul>
            <ul className="sm:flex space-x-6 hidden">
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
          <nav className={`${mob ? 'flex' : 'hidden'} sm:hidden top-4 flex-col fixed w-full  left-3`}>
            <ul className='flex flex-col bg-white border-b-gray-700 rounded-2xl text-black w-[95%] px-4 py-3 gap-2 text-lg'>
              {isAuthenticated ? (
                <>
                  <div className='flex justify-between'>
                    <li onClick={() => setMob((val) => !val)}>
                      <Link
                        href="/dashboard"
                        className={`flex relative justify-end gap-1 hover:text-primary-200 transition-colors`}
                      >
                        <span className='text-xl font-bold'>File Portal</span>
                      </Link>
                    </li>
                    <li onClick={() => setMob((val) => !val)}>
                      <Link
                        href="/dashboard"
                        className={`flex sticky justify-end gap-1 hover:text-primary-200 transition-colors`}
                      >
                        <RxCross1 />
                      </Link>
                    </li>
                  </div>
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
                  <div className='flex justify-between'>
                    <li onClick={() => setMob((val) => !val)}>
                      <Link
                        href="/dashboard"
                        className={`flex relative justify-end gap-1 hover:text-primary-200 transition-colors`}
                      >
                        <span className='text-xl font-bold'>File Portal</span>
                      </Link>
                    </li>
                    <li onClick={() => setMob((val) => !val)}>
                      <Link
                        href="/dashboard"
                        className={`flex sticky justify-end gap-1 hover:text-primary-200 transition-colors`}
                      >
                        <RxCross1 />
                      </Link>
                    </li>
                  </div>
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