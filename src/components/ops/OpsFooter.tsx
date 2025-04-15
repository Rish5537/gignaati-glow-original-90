
import React from 'react';
import { Link } from 'react-router-dom';

const OpsFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            Operations Console v1.0.0 | Last updated: April 15, 2025
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Link to="/ops/help" className="text-sm text-gray-500 hover:text-gray-800">Help</Link>
            <Link to="/ops/security" className="text-sm text-gray-500 hover:text-gray-800">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OpsFooter;
