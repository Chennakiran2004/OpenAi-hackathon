import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'bordered' | 'glass';
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    style?: React.CSSProperties;
}

export default function Card({
    children,
    variant = 'default',
    className = '',
    onClick,
    hover = false,
    style
}: CardProps) {
    const baseStyles = 'rounded-lg p-6 transition-all duration-250';

    const variantStyles = {
        default: 'bg-white border border-gray-200 shadow-sm',
        elevated: 'bg-white shadow-md border border-gray-200',
        bordered: 'bg-white border-2 border-gray-300',
        glass: 'glass'
    };

    const hoverStyles = hover || onClick ? 'hover-lift cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
