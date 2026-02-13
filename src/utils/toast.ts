import toast from 'react-hot-toast';

/**
 * Custom toast notifications with green theme
 * Position: bottom-right
 */

const toastOptions = {
    duration: 4000,
    position: 'bottom-right' as const,
    style: {
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
    },
};

/**
 * Success toast (Green theme)
 */
export const showSuccess = (message: string) => {
    return toast.success(message, {
        ...toastOptions,
        icon: '✓',
        style: {
            ...toastOptions.style,
            background: '#2BB673',
            color: '#ffffff',
            border: '1px solid #1F7A4D',
            boxShadow: '0 4px 12px rgba(43, 182, 115, 0.25)',
        },
    });
};

/**
 * Error toast (Red theme)
 */
export const showError = (message: string) => {
    return toast.error(message, {
        ...toastOptions,
        icon: '✕',
        duration: 5000, // Longer duration for errors
        style: {
            ...toastOptions.style,
            background: '#EF4444',
            color: '#ffffff',
            border: '1px solid #DC2626',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
        },
    });
};

/**
 * Warning toast (Amber theme)
 */
export const showWarning = (message: string) => {
    return toast(message, {
        ...toastOptions,
        icon: '⚠',
        style: {
            ...toastOptions.style,
            background: '#F59E0B',
            color: '#ffffff',
            border: '1px solid #D97706',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
        },
    });
};

/**
 * Info toast (Dark Green theme)
 */
export const showInfo = (message: string) => {
    return toast(message, {
        ...toastOptions,
        icon: 'ℹ',
        style: {
            ...toastOptions.style,
            background: '#1F7A4D',
            color: '#ffffff',
            border: '1px solid #166534',
            boxShadow: '0 4px 12px rgba(31, 122, 77, 0.25)',
        },
    });
};

/**
 * Loading toast (returns toast ID for dismissal)
 */
export const showLoading = (message: string) => {
    return toast.loading(message, {
        ...toastOptions,
        style: {
            ...toastOptions.style,
            background: '#1F7A4D',
            color: '#ffffff',
            border: '1px solid #166534',
        },
    });
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
    toast.dismiss();
};

/**
 * Promise toast - shows loading, then success/error based on promise result
 */
export const showPromiseToast = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            ...toastOptions,
            success: {
                style: {
                    ...toastOptions.style,
                    background: '#2BB673',
                    color: '#ffffff',
                    border: '1px solid #1F7A4D',
                },
                icon: '✓',
            },
            error: {
                style: {
                    ...toastOptions.style,
                    background: '#EF4444',
                    color: '#ffffff',
                    border: '1px solid #DC2626',
                },
                icon: '✕',
                duration: 5000,
            },
            loading: {
                style: {
                    ...toastOptions.style,
                    background: '#1F7A4D',
                    color: '#ffffff',
                    border: '1px solid #166534',
                },
            },
        }
    );
};
