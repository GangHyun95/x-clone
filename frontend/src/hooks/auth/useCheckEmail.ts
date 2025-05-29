import { useState } from 'react';
import { checkEmailExists } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';
import type { UseFormSetError } from 'react-hook-form';

type Props = {
    onSuccess: (data: { email: string }) => void;
    setError: UseFormSetError<{ email: string }>;
};

export function useCheckEmail({ onSuccess, setError }: Props) {
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const checkEmail = async (payload: { email: string}) => {
        setIsCheckingEmail(true);
        try {
            const { exists, email } = await checkEmailExists(payload);
            if (exists) onSuccess({ email });
        } catch (err) {
            handleFormErrors<{ email: string }>(err, setError);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    return {
        checkEmail,
        isCheckingEmail,
    };
}
