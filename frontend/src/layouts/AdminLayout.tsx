import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { LogOut, Menu } from 'lucide-react';
import Navigation from '../components/Navigation';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>

                <Navigation />

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.email}
                            </p>
                            <p className="text-xs text-gray-500 truncate italic">
                                Professional Access
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header (visible only on small screens) */}
                <header className="bg-white shadow-sm border-b border-gray-200 md:hidden flex items-center justify-between p-4">
                    <span className="font-bold text-gray-800">Admin Panel</span>
                    <button className="text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
