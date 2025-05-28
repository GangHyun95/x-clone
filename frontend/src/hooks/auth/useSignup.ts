import { useMutation } from '@tanstack/react-query';
import { sendEmailCode, signup, verifyEmailCode } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';
import type {
    SendCodePayload,
    SignupPayload,
    VerifyCodePayload,
} from '@/types/auth';
import type { UseFormSetError } from 'react-hook-form';

type SendCode = {
    setError: UseFormSetError<SendCodePayload>;
    onSuccess: (data: {
        email: string;
        fullName: string;
        expiresAt: number;
    }) => void;
};

type VerifyCode = {
    setError: UseFormSetError<VerifyCodePayload>;
    onSuccess: () => void;
};

type ResendCode = {
    setError: UseFormSetError<VerifyCodePayload>;
    onSuccess: (expiresAt: number) => void;
};

type CompleteSignup = {
    setError: UseFormSetError<SignupPayload>;
    onSuccess: (data: { accessToken: string}) => void;
};

export function useSendCode({ onSuccess, setError }: SendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: (payload: SendCodePayload) => sendEmailCode(payload),
        onSuccess: (res, variables) => {
            onSuccess({
                email: variables.email,
                fullName: variables.fullName,
                expiresAt: res.data.expiresAt,
            });
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

export function useResendCode({ onSuccess }: ResendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: (email: string) => sendEmailCode({ email, isResend: true }),
        onSuccess: (res) => {
            onSuccess(res.data.expiresAt);
        },
        onError: () => {
            // toast.error('인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return {
        resendCode: mutate,
        isResending: isPending,
    };
}

export function useCompleteSignup ({ onSuccess, setError }: CompleteSignup) {
    const { mutate, isPending } = useMutation({
        mutationFn: (payload: SignupPayload) => signup(payload),
        onSuccess: (data) => {
            onSuccess(data);
        },
        onError: (err) => {
            handleFormErrors<SendCodePayload>(err, setError);
        },
    });

    return {
        signup: mutate,
        isSigningUp: isPending,
    };
};
