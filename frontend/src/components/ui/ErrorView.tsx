import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';

interface ErrorViewProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred while fetching data.',
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 w-full max-w-2xl mx-auto" id="error-view">
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorView;
