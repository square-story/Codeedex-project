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

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState(true);
    const { permissions } = useAuth();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await adminApi.getRoles();
            setRoles(response.data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
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
                        <div className="py-10 text-center text-gray-500">Loading roles...</div>
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
                                {roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                                            No roles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map((role) => (
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Roles;
