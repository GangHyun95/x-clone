import { deleteAccount, updatePassword } from '@/service/user';
import type { UpdatePasswordPayload } from '@/types/user';
import { handleFormErrors } from '@/utils/handleFormErrors';
import { useState } from 'react';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

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

export function useUpdatePassword({ setError, onSuccess }: WithSetError<UpdatePasswordPayload, void>) {
    const [updating, setUpdating] = useState(false);

    const update = async (payload: UpdatePasswordPayload) => {
        setUpdating(true);
        await handleApiAction(() => updatePassword(payload), {
            setError,
            onSuccess: () => onSuccess(),
        });
        setUpdating(false);
    };

    return { update, updating };
}

export function useDeleteAccount({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) {
    const [deleting, setDeleting] = useState(false);

    const remove = async () => {
        setDeleting(true);
        try {
            await deleteAccount();
            onSuccess();
        } catch {
            onError();
        } finally {
            setDeleting(false);
        }
    };

    return { remove, deleting };
}