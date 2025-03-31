import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FaExclamationTriangle className="text-yellow-500 text-5xl mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="bg-primary-600 text-white hover:bg-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
} 