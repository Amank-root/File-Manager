import React from 'react';
import Link from 'next/link';
import { FaFileUpload, FaChartBar, FaUserCircle } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Manage Your Files with Ease
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Upload, organize, and access your files from anywhere with our secure file management system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/register" 
              className="bg-gray-600 text-primary-700 hover:bg-gray-500 px-6 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/login" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full text-black py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaFileUpload className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">File Management</h3>
              <p className="text-gray-600">
                Easily upload, download, and organize your files with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartBar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Get insights into your file usage with detailed analytics and breakdowns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserCircle className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Profile</h3>
              <p className="text-gray-600">
                Customize your profile and manage multiple addresses for your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our platform for their file management needs.
          </p>
          <Link 
            href="/register" 
            className="bg-white text-black hover:bg-primary-700 px-6 py-3 rounded-md font-medium text-lg transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
