import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import type { IUser } from '../../api/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

const UserPanel: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await usersApi.getUsers();
                setUsers(response.data.users);
            } catch (err: any) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
                <p className="text-muted-foreground">
                    Viewing users within your accessible scope.
                </p>
            </div>

            {error ? (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 flex items-center gap-3 text-red-700">
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>People</CardTitle>
                        <CardDescription>
                            Data visibility is automatically filtered based on your permissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-10 text-center text-gray-500">Loading directory...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User Email</TableHead>
                                        <TableHead>Account Status</TableHead>
                                        <TableHead className="text-right">Relationship</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user._id} className={user._id === currentUser?._id ? 'bg-blue-50/50' : ''}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                        Active
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right text-gray-400 text-sm">
                                                    {user._id === currentUser?._id ? 'You' : 'Member'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserPanel;
