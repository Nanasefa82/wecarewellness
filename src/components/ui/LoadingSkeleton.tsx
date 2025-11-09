import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
    rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '', rows = 3 }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;