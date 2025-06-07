export function getEmailUsername(email: string): string {
    return '@' + email.split('@')[0];
}

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