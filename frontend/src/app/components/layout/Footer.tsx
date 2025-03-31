import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} FilePortal. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">A modern file management application.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 