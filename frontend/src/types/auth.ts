export type SendCodePayload = {
    email: string;
    fullName: string;
};

export type VerifyCodePayload = {
    email: string;
    code: string;
};

export type ResendCodePayload = {
    email: string;
    isResend: true;
};

export type SignupPayload = {
    email: string;
    fullName: string;
    nickname: string;
    password: string;
}