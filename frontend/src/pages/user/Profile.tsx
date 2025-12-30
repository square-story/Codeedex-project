import React from 'react';
import { useAuth } from '../../auth/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { User, Shield, Info, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, permissions } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            Account Information
                        </CardTitle>
                        <CardDescription>Essential details about your identity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-gray-500">Email Address</span>
                            <span className="text-lg flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                {user?.email}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-gray-500">Account ID</span>
                            <span className="text-sm font-mono text-gray-400">{user?._id}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-gray-500">Account Created</span>
                            <span className="text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions & Scopes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            Active Scopes & Permissions
                        </CardTitle>
                        <CardDescription>Permissions granted to your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {permissions.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No permissions granted.</p>
                            ) : (
                                permissions.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                        <span className="text-sm font-medium font-mono text-gray-700">{p.key}</span>
                                        <Badge variant="outline" className="capitalize">
                                            {p.scope}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
