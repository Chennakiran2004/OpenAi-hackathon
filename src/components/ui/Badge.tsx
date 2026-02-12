import React from 'react';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'info' | 'default' | 'best-cost' | 'fastest' | 'lowest-carbon';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    className?: string;
}

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    icon,
    className = ''
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';

    const variantStyles = {
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        default: 'bg-slate-700 text-slate-600 border border-slate-600',
        'best-cost': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        'fastest': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        'lowest-carbon': 'bg-green-500/20 text-green-400 border border-green-500/30'
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </span>
    );
}
