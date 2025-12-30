import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { hasPermission } from '../utils/permissions';
import { PERMISSIONS } from '../utils/constants';
import {
    LayoutDashboard,
    Users,
    Shield,
    FileText,
    UsersRound
} from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
    permission?: string;
}

const Navigation: React.FC = () => {
    const { permissions } = useAuth();
    const location = useLocation();

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            path: '/admin',
            icon: LayoutDashboard,
        },
        {
            label: 'Users',
            path: '/admin/users',
            icon: Users,
            permission: PERMISSIONS.USERS_READ
        },
        {
            label: 'Roles',
            path: '/admin/roles',
            icon: Shield,
            permission: PERMISSIONS.ROLES_READ
        },
        {
            label: 'Teams',
            path: '/admin/teams',
            icon: UsersRound,
            permission: PERMISSIONS.TEAMS_READ
        },
        {
            label: 'Audit Logs',
            path: '/admin/audit',
            icon: FileText,
            permission: PERMISSIONS.AUDIT_READ
        }
    ];

    const visibleItems = navItems.filter(item =>
        !item.permission || hasPermission(permissions, item.permission)
    );

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="flex-1 p-4 space-y-1">
            {visibleItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive(item.path)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;
