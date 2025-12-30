import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { LogOut, User } from 'lucide-react';

const UserLayout: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-xl font-bold text-gray-900 border-r pr-6 mr-2">
                            MyApp
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Dashboard
                            </Link>
                            <Link to="/directory" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Directory
                            </Link>
                            <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Profile
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User className="w-4 h-4" />
                            <span>{user?.email}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
