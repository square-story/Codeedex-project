import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
            <p className="text-xl text-gray-700 mb-6">
                You do not have permission to view this page.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default AccessDenied;
