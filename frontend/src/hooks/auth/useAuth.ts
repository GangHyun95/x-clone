import { useState } from 'react';
import type { FieldValues, UseFormSetError } from 'react-hook-form'

import { login, logout, signup, sendEmailCode, verifyEmailCode, checkEmailExists, resetPassword } from '@/service/auth';
import type { LoginPayload, SignupPayload, SendCodePayload, VerifyCodePayload, ResetPasswordPayload } from '@/types/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';

async function handleApiAction<T, TFieldValues extends FieldValues>(
    fn: () => Promise<T>,
    options: {
        setError: UseFormSetError<TFieldValues>;
        onSuccess: (data: T) => void;
    }
) {
    try {
        const result = await fn();
        options.onSuccess?.(result);
    } catch (error) {
        handleFormErrors(error, options.setError);
    }
}

type WithSetError<T extends FieldValues, D> = {
    onSuccess: (data: D) => void;
    setError: UseFormSetError<T>;
};

type WithErrorHandler<T> = {
    onSuccess: (data: T) => void;
    onError: () => void;
};

export function useSignup({ setError, onSuccess }: WithSetError<SignupPayload, { accessToken: string }>) {
    const [isSigningUp, setIsSigningUp] = useState(false);

    const signupRequest = async (payload: SignupPayload) => {
        setIsSigningUp(true);
        await handleApiAction(() => signup(payload), {
            setError,
            onSuccess: (res) => onSuccess(res.data) });
        setIsSigningUp(false);
    };

    return { signup: signupRequest, isSigningUp };
}

export function useLogin({ onSuccess, setError }: WithSetError<LoginPayload, { accessToken: string }>) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    

    const loginRequest = async (payload: LoginPayload) => {
        setIsLoggingIn(true);
        await handleApiAction(() => login(payload), {
            setError,
            onSuccess: (res) => onSuccess(res.data),
        });
        setIsLoggingIn(false);
    };

    return { login: loginRequest, isLoggingIn };
}

export function useLogout({ onSuccess, onError }: { onSuccess: () => void; onError: ({ message }: { message: string}) => void }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logoutRequest = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            onSuccess();
        } catch (error) {
            const { message } = JSON.parse((error as Error).message);
            onError({ message });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { logout: logoutRequest, isLoggingOut };
};

export function useSendCode({ onSuccess, setError }: WithSetError<SendCodePayload, { email: string; fullName: string; expiresAt: number }>) {
    const [isSending, setIsSending] = useState(false);

    const sendCode = async (payload: SendCodePayload) => {
        setIsSending(true);
        await handleApiAction(() => sendEmailCode(payload), {
            setError,
            onSuccess: (res) => onSuccess({
                email: payload.email,
                fullName: payload.fullName,
                expiresAt: res.data.expiresAt
            }),
        });
        setIsSending(false);
    };

    return { sendCode, isSending };
}

export function useVerifyCode({ onSuccess, setError }: WithSetError<VerifyCodePayload, void>) {
    const [isVerifying, setIsVerifying] = useState(false);

    const verifyCode = async (payload: VerifyCodePayload) => {
        setIsVerifying(true);
        await handleApiAction(() => verifyEmailCode(payload), {
            setError,
            onSuccess: () => onSuccess(),
        });
        setIsVerifying(false);
    };

    return { verifyCode, isVerifying };
}

export function useResendCode({ onSuccess, onError }: WithErrorHandler<{ expiresAt: number; message: string }>) {
    const [isResending, setIsResending] = useState(false);

    const resendCode = async (email: string) => {
        setIsResending(true);
        try {
            const res = await sendEmailCode({ email, isResend: true });
            onSuccess({ expiresAt: res.data.expiresAt, message: res.message });
        } catch {
            onError();
        } finally {
            setIsResending(false);
        }
    };
    return { resendCode, isResending };
}

export function usePasswordResetCode({ onSuccess, onError }: WithErrorHandler<{ expiresAt: number; message: string }>) {
    const [isSending, setIsSending] = useState(false);

    const sendPasswordResetCode = async (email: string) => {
        setIsSending(true);
        try {
            const res = await sendEmailCode({ email, isPasswordReset: true });
            onSuccess({ expiresAt: res.data.expiresAt, message: res.message });
        } catch {
            onError();
        } finally {
            setIsSending(false);
        }
    };

    return { sendPasswordResetCode, isSending };
}

export function useResetPassword({ setError, onSuccess }: WithSetError<ResetPasswordPayload, void>) {
    const [isResetting, setIsResetting] = useState(false);

    const reset = async (payload: ResetPasswordPayload) => {
        setIsResetting(true);

        await handleApiAction(() => resetPassword(payload), {
            setError,
            onSuccess: () => onSuccess(),
        });
        setIsResetting(false);
    };

    return { resetPassword: reset, isResetting };
}

export function useCheckEmail({ onSuccess, setError }: WithSetError<{ email: string }, { email: string }>) {
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const checkEmail = async (payload: { email: string }) => {
        setIsCheckingEmail(true);
        try {
            const { exists, email } = await checkEmailExists(payload);
            if (exists) onSuccess({ email });
        } catch (err) {
            handleFormErrors(err, setError);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    return { checkEmail, isCheckingEmail };
}
