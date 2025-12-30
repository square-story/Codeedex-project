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
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import LoadingView from '../../components/ui/LoadingView';
import ErrorView from '../../components/ui/ErrorView';
import EmptyState from '../../components/ui/EmptyState';

const UserPanel: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
                <p className="text-muted-foreground">
                    Viewing users within your accessible scope.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>People</CardTitle>
                    <CardDescription>
                        Data visibility is automatically filtered based on your permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingView message="Retrieving directory..." />
                    ) : error ? (
                        <ErrorView
                            message={error}
                            onRetry={fetchUsers}
                            title="Directory Sync Failed"
                        />
                    ) : users.length === 0 ? (
                        <EmptyState
                            title="No Members Found"
                            description="You don't have access to any other user records at this time."
                        />
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
                                {users.map((user) => (
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
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserPanel;
