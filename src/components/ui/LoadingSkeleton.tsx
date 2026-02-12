import React from 'react';

export interface LoadingSkeletonProps {
    variant?: 'text' | 'card' | 'circle' | 'rectangle';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
}

export default function LoadingSkeleton({
    variant = 'text',
    width,
    height,
    count = 1,
    className = ''
}: LoadingSkeletonProps) {
    const baseStyles = 'skeleton';

    const variantStyles = {
        text: 'h-4 w-full rounded',
        card: 'h-32 w-full rounded-xl',
        circle: 'rounded-full',
        rectangle: 'rounded-lg'
    };

    const style: React.CSSProperties = {
        width: width || undefined,
        height: height || undefined
    };

    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    ));

    return count > 1 ? (
        <div className="space-y-3">
            {skeletons}
        </div>
    ) : (
        <>{skeletons}</>
    );
}
