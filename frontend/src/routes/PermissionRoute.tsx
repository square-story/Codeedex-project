import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { hasPermission } from '../utils/permissions';

interface PermissionRouteProps {
    permissionKey: string;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ permissionKey }) => {
    const { permissions, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!permissions || !hasPermission(permissions, permissionKey)) {
        return <Navigate to="/access-denied" replace />;
    }

    return <Outlet />;
};

export default PermissionRoute;
