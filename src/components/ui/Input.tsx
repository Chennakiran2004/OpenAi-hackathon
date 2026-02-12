import React from 'react';

export interface InputProps {
    label?: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
}

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    helperText,
    icon,
    className = '',
    min,
    max,
    step
}: InputProps) {
    const inputId = React.useId();

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    className={`
            w-full rounded-lg px-4 py-2.5 
            bg-white border 
            ${error ? 'border-red-500 focus:border-red-400' : 'border-gray-300 focus:border-green-500'}
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500/20' : 'focus:ring-green-500/20'}
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-250
            ${icon ? 'pl-10' : ''}
          `}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
