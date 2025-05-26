import { useMutation } from '@tanstack/react-query';
import { sendEmailCode, verifyEmailCode } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';
import toast from 'react-hot-toast';
import type { EmailVerifyPayload } from '@/types/auth';

export function useEmailVerification({
    email,
    onVerifySuccess,
    onResendSuccess,
    setError,
    setFocus,
}: {
    email: string;
    onVerifySuccess: () => void;
    onResendSuccess: (expiresAt: number) => void;
    setError: any; // from useForm
    setFocus: (field: string) => void;
}) {
    const verifyMutation = useMutation({
        mutationFn: (payload: EmailVerifyPayload) =>
            verifyEmailCode({ ...payload, email }),
        onSuccess: onVerifySuccess,
        onError: (error) => {
            handleFormErrors<EmailVerifyPayload>(error, setError);
        },
    });

    const resendMutation = useMutation({
        mutationFn: () => sendEmailCode({ email, isResend: true }),
        onSuccess: (response) => {
            const expiresAt = response.data?.expiresAt;
            if (expiresAt) onResendSuccess(expiresAt);
            setFocus('code');
        },
        onError: () => {
            toast.error('인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    return {
        resendCode: resendMutation.mutate,
        isResending: resendMutation.isPending,
        verifyCode: verifyMutation.mutate,
        isVerifying: verifyMutation.isPending,
    };
}
