/**
 * Format number as Indian currency (₹)
 * @param amount - Amount in rupees
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string): string {
    const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
    const num = Number(parsed);

    if (!Number.isFinite(num)) return '₹0';

    // Indian number system (lakhs, crores)
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
        return `₹${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
        return `₹${(num / 1000).toFixed(2)} K`;
    }

    return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/**
 * Format number with Indian number system
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | string): string {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    const n = Number(parsed);

    if (!Number.isFinite(n)) return '0';

    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/**
 * Format weight in tonnes
 * @param tonnes - Weight in tonnes
 * @returns Formatted weight string
 */
export function formatTonnes(tonnes: number | string): string {
    const parsed = typeof tonnes === 'string' ? parseFloat(tonnes) : tonnes;
    const num = Number(parsed);

    if (!Number.isFinite(num)) return '0 T';

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)} MT`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(2)} KT`;
    }

    return `${num.toLocaleString('en-IN')} T`;
}

/**
 * Format distance in kilometers
 * @param km - Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(km: number): string {
    if (km >= 1000) {
        return `${(km / 1000).toFixed(1)}K km`;
    }
    return `${km.toFixed(0)} km`;
}

/**
 * Format carbon footprint
 * @param kg - Carbon in kilograms
 * @returns Formatted carbon string
 */
export function formatCarbon(kg: number): string {
    if (kg >= 1000) {
        return `${(kg / 1000).toFixed(2)} tonnes CO₂`;
    }
    return `${kg.toFixed(0)} kg CO₂`;
}

/**
 * Format delivery time in days
 * @param days - Number of days
 * @returns Formatted time string
 */
export function formatDeliveryTime(days: number): string {
    if (days < 1) {
        const hours = Math.round(days * 24);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    const wholeDays = Math.floor(days);
    const hours = Math.round((days - wholeDays) * 24);

    if (hours === 0) {
        return `${wholeDays} ${wholeDays === 1 ? 'day' : 'days'}`;
    }

    return `${wholeDays}d ${hours}h`;
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const then = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;

    return formatDate(then);
}

/**
 * Format date as absolute date (e.g., "Feb 12, 2026")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format date with time (e.g., "Feb 12, 2026 3:30 PM")
 * @param date - Date string or Date object
 * @returns Formatted date-time string
 */
export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
