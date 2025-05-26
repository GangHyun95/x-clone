import { useMutation } from '@tanstack/react-query';
import { sendEmailCode, verifyEmailCode } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';
import toast from 'react-hot-toast';
import type { SendCodePayload, VerifyCodePayload } from '@/types/auth';
import type { UseFormSetError } from 'react-hook-form';

type SendCode = {
    setError: UseFormSetError<SendCodePayload>;
    onSuccess: (email: string, expiresAt: number) => void;
};

type VerifyCode = {
    setError: UseFormSetError<VerifyCodePayload>;
    onSuccess: () => void;
};

type ResendCode = {
    email: string;
    onSuccess: (expiresAt: number) => void;
};

export function useSendCode({ onSuccess, setError }: SendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: (payload: SendCodePayload) => sendEmailCode(payload),
        onSuccess: (res, variables) => {
            onSuccess(variables.email, res.data.expiresAt);
        },
        onError: (err) => {
            handleFormErrors<SendCodePayload>(err, setError);
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
            handleFormErrors<VerifyCodePayload>(err, setError);
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
