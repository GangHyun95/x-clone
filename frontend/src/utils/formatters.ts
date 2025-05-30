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

