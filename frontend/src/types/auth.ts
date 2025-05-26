export type EmailVerifyPayload = {
    email: string;
    fullName?: string;
    code?: string;
    isResend?: boolean;
};