export function maskEmail(email: string) {
    const [local, domain] = email.split('@');

    const maskedLocal = local.length <= 2
        ? local[0] + '*'.repeat(local.length - 1)
        : local.slice(0, 2) + '*'.repeat(local.length - 2);

    const maskedDomain = domain.length <= 1
        ? '*'
        : domain[0] + '*'.repeat(domain.indexOf('.') !== -1 ? domain.indexOf('.') - 1 : domain.length - 1);

    return `${maskedLocal}@${maskedDomain}`;
}

export function formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function formatTimeFromNow(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

export function formatJoinDate(isoString: string): string {
    const date = new Date(isoString);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `Joined ${monthName} ${year}`;
}

export function formatFullDateKST(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const ampmHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${months[month]} ${day}, ${year}, ${ampmHour}:${pad(minute)}:${pad(second)} ${ampm}`;
}
