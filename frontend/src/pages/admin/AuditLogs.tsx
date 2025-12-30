import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { History, User as UserIcon, Box } from 'lucide-react';

interface AuditLog {
    _id: string;
    performedBy: {
        _id: string;
        email: string;
    } | string;
    action: string;
    targetResource: string;
    details: any;
    createdAt: string;
}

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await adminApi.getAuditLogs();
            setLogs(response.data.logs);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <History className="w-8 h-8 text-gray-700" />
                    Audit Trail
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activity Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-10 text-center text-gray-500">Loading logs...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                            No audit logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell className="text-sm font-mono text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {typeof log.performedBy === 'object' ? log.performedBy.email : log.performedBy}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="uppercase text-[10px] font-bold">
                                                    {formatAction(log.action)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Box className="w-3 h-3" />
                                                    {log.targetResource}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <pre className="text-[10px] bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                                                    {JSON.stringify(log.details, null, 2)}
                                                </pre>
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

export default AuditLogs;
