import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import type { IRole } from '../../api/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../auth/useAuth';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../utils/constants';
import { Plus, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import LoadingView from '../../components/ui/LoadingView';
import ErrorView from '../../components/ui/ErrorView';
import EmptyState from '../../components/ui/EmptyState';

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { permissions } = useAuth();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminApi.getRoles();
            setRoles(response.data.roles);
        } catch (err: any) {
            console.error('Error fetching roles:', err);
            setError(err.response?.data?.message || 'Failed to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const canCreate = hasPermission(permissions, PERMISSIONS.ROLES_CREATE);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Roles Management</h2>
                {canCreate && (
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Internal Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingView message="Fetching system roles..." />
                    ) : error ? (
                        <ErrorView
                            message={error}
                            onRetry={fetchRoles}
                            title="Failed to Load Roles"
                        />
                    ) : roles.length === 0 ? (
                        <EmptyState
                            title="No Roles Assigned"
                            description="There are currently no roles defined in the system. Use the 'Create Role' button to get started."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Permissions Count</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role._id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            {role.name}
                                        </TableCell>
                                        <TableCell>{role.permissions.length} permissions</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Roles;
