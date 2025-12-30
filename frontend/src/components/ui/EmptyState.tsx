import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No data found',
    description = 'It looks like there is nothing to show here yet.'
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center w-full" id="empty-state">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Inbox className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;
