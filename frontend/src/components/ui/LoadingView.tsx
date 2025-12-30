import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
    message?: string;
    fullPage?: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({
    message = 'Loading...',
    fullPage = false
}) => {
    const containerClasses = fullPage
        ? "fixed inset-0 flex items-center justify-center bg-white/80 z-50"
        : "flex flex-col items-center justify-center py-12 w-full";

    return (
        <div className={containerClasses} id="loading-view">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-muted-foreground font-medium">{message}</p>
        </div>
    );
};

export default LoadingView;
