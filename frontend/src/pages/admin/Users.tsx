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
import { Plus, User as UserIcon, Users as UsersIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const Users: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const { permissions } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes, teamsRes] = await Promise.all([
                usersApi.getUsers(),
                adminApi.getRoles(),
                adminApi.getTeams()
            ]);
            setUsers(usersRes.data.users);
            setRoles(rolesRes.data.roles);
            setTeams(teamsRes.data.teams);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTeamName = (teamId: string | null) => {
        if (!teamId) return 'N/A';
        return teams.find(t => t._id === teamId)?.name || 'Unknown';
    };

    const canCreate = hasPermission(permissions, PERMISSIONS.USERS_CREATE);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
                {canCreate && (
                    <Button className="flex items-center gap-2">
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
                        <div className="py-10 text-center text-gray-500">Loading users...</div>
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
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
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

export default Users;
