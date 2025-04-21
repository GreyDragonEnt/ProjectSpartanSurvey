import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const FourOhFour: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-2 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FourOhFour;