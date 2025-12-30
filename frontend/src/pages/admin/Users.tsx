import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import { adminApi } from '../../api/admin.api';
import type { IUser, IRole, ITeam } from '../../api/types';
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
import { Plus, User as UserIcon, Users as UsersIcon, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import LoadingView from '../../components/ui/LoadingView';
import ErrorView from '../../components/ui/ErrorView';
import EmptyState from '../../components/ui/EmptyState';
import UserDialog from '../../components/admin/UserDialog';

const Users: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const { permissions } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, rolesRes, teamsRes] = await Promise.all([
                usersApi.getUsers(),
                adminApi.getRoles(),
                adminApi.getTeams()
            ]);
            setUsers(usersRes.data.users);
            setRoles(rolesRes.data.roles);
            setTeams(teamsRes.data.teams);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to load user management data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleSave = async (data: any) => {
        if (selectedUser) {
            await usersApi.updateUser(selectedUser._id, data);
        } else {
            await usersApi.createUser(data);
        }
        await fetchData(); // Refresh list after save
    };

    const getTeamName = (teamId: string | null) => {
        if (!teamId) return 'N/A';
        return teams.find(t => t._id === teamId)?.name || 'Unknown';
    };

    const canCreate = hasPermission(permissions, PERMISSIONS.USERS_CREATE);
    const canUpdate = hasPermission(permissions, PERMISSIONS.USERS_UPDATE);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
                {canCreate && (
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create User
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingView message="Loading user directory..." />
                    ) : error ? (
                        <ErrorView
                            message={error}
                            onRetry={fetchData}
                            title="Failed to Load Users"
                        />
                    ) : users.length === 0 ? (
                        <EmptyState
                            title="No Users Registered"
                            description="There are currently no users in the system matches your view scope."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                                    {user.email}
                                                </span>
                                                <span className="text-xs text-gray-400 pl-6">ID: {user._id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.roles.map(roleId => {
                                                    const role = roles.find(r => r._id === roleId);
                                                    return role ? (
                                                        <Badge key={roleId} variant="secondary">
                                                            {role.name}
                                                        </Badge>
                                                    ) : null;
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4 text-gray-400" />
                                                {getTeamName(user.teamId)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {canUpdate && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(user)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Edit
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                roles={roles}
                teams={teams}
                onSave={handleSave}
            />
        </div>
    );
};

export default Users;
