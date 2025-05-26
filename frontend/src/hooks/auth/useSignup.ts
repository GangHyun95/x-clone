import { useMutation } from '@tanstack/react-query';
import { sendEmailCode, verifyEmailCode } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';
import toast from 'react-hot-toast';
import type { EmailVerifyPayload } from '@/types/auth';
import type { UseFormSetError } from 'react-hook-form';

type SendCode = {
    setError: UseFormSetError<EmailVerifyPayload>;
    onSuccess: (email: string, expiresAt: number) => void;
};

type VerifyCode = {
    setError: UseFormSetError<EmailVerifyPayload>;
    onSuccess: () => void;
};

type ResendCode = {
    email: string;
    onSuccess: (expiresAt: number) => void;
};

export function useSendCode({ onSuccess, setError }: SendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: (payload: EmailVerifyPayload) => sendEmailCode(payload),
        onSuccess: (res, variables) => {
            if ('expiresAt' in res.data) {
                onSuccess(variables.email, res.data.expiresAt);
            }
        },
        onError: (err) => {
            handleFormErrors<EmailVerifyPayload>(err, setError);
        },
    });

    return {
        sendCode: mutate,
        isSending: isPending,
    };
}

export function useVerifyCode({ onSuccess, setError }: VerifyCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: verifyEmailCode,
        onSuccess,
        onError: (err) => {
            handleFormErrors<EmailVerifyPayload>(err, setError);
        },
    });

    return {
        verifyCode: mutate,
        isVerifying: isPending,
    };
}

export function useResendCode({ email, onSuccess }: ResendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: () => sendEmailCode({ email, isResend: true }),
        onSuccess: (res) => {
            onSuccess(res.data.expiresAt);
        },
        onError: () => {
            toast.error('인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return {
        resendCode: mutate,
        isResending: isPending,
    };
}
