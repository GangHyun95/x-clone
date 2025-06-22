const MONTHS_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_LONG = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const pad = (n: number) => n.toString().padStart(2, '0');

export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');

    const maskedLocal = local.length <= 2
        ? local[0] + '*'.repeat(local.length - 1)
        : local.slice(0, 2) + '*'.repeat(local.length - 2);

    const maskedDomain = domain.length <= 1
        ? '*'
        : domain[0] + '*'.repeat(domain.indexOf('.') !== -1 ? domain.indexOf('.') - 1 : domain.length - 1);

    return `${maskedLocal}@${maskedDomain}`;
}

export function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${pad(seconds)}`;
}

export function formatTimeFromNow(isoString: string): string {
    const date = new Date(isoString);
    const diff = Date.now() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}
export function formatJoinDate(isoString: string): string {
    const date = new Date(isoString);
    return `Joined ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatFullDateKST(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = MONTHS_SHORT[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const ampmHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    return `${month} ${day}, ${year}, ${ampmHour}:${pad(minute)}:${pad(second)} ${ampm}`;
}

export function formatPostTimestamp(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = MONTHS_SHORT[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const ampmHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    return `${ampmHour}:${pad(minute)} ${ampm} · ${month} ${day}, ${year}`;
}
