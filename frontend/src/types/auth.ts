type EmailPayload = {
    email: string;
};

export type SendCodePayload = EmailPayload & {
    fullName: string;
};

export type VerifyCodePayload = EmailPayload & {
    code: string;
};

export type ResendCodePayload = EmailPayload & {
    isResend: true;
};

export type ResetCodePayload = EmailPayload & {
    isPasswordReset: true;
};

export type ResetPasswordPayload = EmailPayload & {
    password: string;
    confirmPassword: string;
}

export type SignupPayload = EmailPayload & {
    fullName: string;
    nickname: string;
    password: string;
};

export type LoginPayload = EmailPayload & {
    password: string;
};