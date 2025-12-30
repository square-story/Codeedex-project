import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { ShieldAlert, Home } from 'lucide-react';

const AccessDenied: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="max-w-md w-full text-center shadow-lg border-red-100">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-red-100 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">403 - Access Denied</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Oops! You don't have the required permissions to access this specific area of the application.
                    </p>
                    <p className="text-sm text-gray-400 italic">
                        If you believe this is an error, please contact your system administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-6">
                    <Button asChild variant="default" className="w-full sm:w-auto">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Return to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AccessDenied;
