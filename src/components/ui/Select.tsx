import React from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps {
    label?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    className?: string;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    error,
    helperText,
    className = ''
}: SelectProps) {
    const selectId = React.useId();

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-slate-600 mb-2">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`
            w-full rounded-lg px-4 py-2.5 pr-10
            bg-slate-100 border 
            ${error ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-emerald-500'}
            text-slate-800
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500/20' : 'focus:ring-emerald-500/20'}
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-250
            appearance-none cursor-pointer
          `}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
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
                <p className="mt-1.5 text-sm text-slate-400">{helperText}</p>
            )}
        </div>
    );
}
