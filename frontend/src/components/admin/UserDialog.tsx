import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { IUser, IRole, ITeam } from '../../api/types';
import { Loader2 } from 'lucide-react';

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: IUser | null; // If present, we are editing
    roles: IRole[];
    teams: ITeam[];
    onSave: (data: any) => Promise<void>;
}

const UserDialog: React.FC<UserDialogProps> = ({
    open,
    onOpenChange,
    user,
    roles,
    teams,
    onSave
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!user;

    useEffect(() => {
        if (open) {
            if (user) {
                setEmail(user.email);
                setPassword(''); // Don't show password for editing
                setSelectedRoles(user.roles);
                setSelectedTeam(user.teamId || '');
            } else {
                setEmail('');
                setPassword('');
                setSelectedRoles([]);
                setSelectedTeam('');
            }
            setError(null);
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload: any = {
                email,
                roles: selectedRoles,
                teamId: selectedTeam === '' ? null : selectedTeam
            };

            if (password) {
                payload.password = password;
            }

            await onSave(payload);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Action failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleRole = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Modify user permissions and team assignments.'
                                : 'Add a new user to the system. They will be able to log in immediately.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="user@example.com"
                                disabled={isEditing} // Email usually not editable for simple implementations
                            />
                        </div>

                        {!isEditing && (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!isEditing}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="team">Primary Team</Label>
                            <select
                                id="team"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                                <option value="">No Team</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Assigned Roles</Label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {roles.map(role => (
                                    <label key={role._id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role._id)}
                                            onChange={() => toggleRole(role._id)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        {role.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserDialog;
