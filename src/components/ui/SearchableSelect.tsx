import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiSearch, HiX, HiInformationCircle } from 'react-icons/hi';
import { FiFrown } from 'react-icons/fi';

export interface SearchableSelectOption {
    value: string | number;
    label: string;
}

export interface SearchableSelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options: SearchableSelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    className?: string;
}

export default function SearchableSelect({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select...',
    required = false,
    disabled = false,
    error,
    helperText,
    className = ''
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectId = React.useId();

    // Get selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : '';

    // Filter options based on search term - WORD-BASED SEARCH
    const filteredOptions = options.filter(option => {
        const searchLower = searchTerm.toLowerCase();
        const labelLower = option.label.toLowerCase();

        // Split search term and label into words
        const searchWords = searchLower.split(/\s+/).filter(w => w.length > 0);

        // Check if any word in the label contains any search word
        return searchWords.every(searchWord =>
            labelLower.split(/\s+/).some(labelWord =>
                labelWord.includes(searchWord)
            )
        );
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm('');
        }
    };

    return (
        <div className={`w-full ${className}`} ref={containerRef} >
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Selected Value Display */}
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200  border border-gray-300 rounded-lg
                        ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : isOpen
                                ? 'border-brand-primary ring-2 ring-primary-100'
                                : 'border-gray-300 hover:border-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-primary-100'
                        }
                        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white cursor-pointer'}
                        flex items-center justify-between gap-2
                    `}
                    style={{ border: '2px solid #DFFCED' }}
                >
                    <span className={displayValue ? 'text-gray-900' : 'text-gray-400 font-normal truncate overflow-hidden whitespace-nowrap'}>
                        {displayValue || placeholder}
                    </span>
                    <HiChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-slide-down">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <div className="relative">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type to search..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-primary-100 transition-all font-normal"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <HiX className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <FiFrown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">No options found</p>
                                    {searchTerm && (
                                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                                    )}
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full text-left px-4 py-2.5 text-sm transition-colors font-normal
                                            ${option.value === value
                                                ? 'bg-brand-primary text-white font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 font-normal">
                    <HiInformationCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p className="mt-2 text-sm text-gray-500 font-normal">{helperText}</p>
            )}
        </div>
    );
}
