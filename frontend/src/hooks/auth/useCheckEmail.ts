import { useState } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import { checkEmailExists } from '@/service/auth';
import { handleFormErrors } from '@/utils/handleFormErrors';

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
            handleFormErrors(err, setError);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    return {
        checkEmail,
        isCheckingEmail,
    };
}
