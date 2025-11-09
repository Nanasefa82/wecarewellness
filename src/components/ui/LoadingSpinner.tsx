import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    text = 'Loading...', 
    className = '' 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <div className={`${sizeClasses[size]} border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mb-4`}></div>
            {text && (
                <p className="text-secondary-600 text-sm animate-pulse">{text}</p>
            )}
        </div>
    );
};

// Page-level loading component
export const PageLoader: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading page..." />
        </div>
    );
};

// Route-level loading component
export const RouteLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" text="Loading..." />
        </div>
    );
};

export default LoadingSpinner;