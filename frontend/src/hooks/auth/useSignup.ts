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
    onSuccess: (data: {
        expiresAt: number;
        message: string;
    }) => void;
    onError: () => void;
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

export function useResendCode({ onSuccess, onError }: ResendCode) {
    const { mutate, isPending } = useMutation({
        mutationFn: (email: string) => sendEmailCode({ email, isResend: true }),
        onSuccess: (res) => {
            onSuccess({
                expiresAt: res.data.expiresAt,
                message: res.message,
            });
        },
        onError,
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
