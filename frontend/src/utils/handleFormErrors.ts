import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function handleFormErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>
) {
    try {
        const parsed = JSON.parse((error as Error).message);
        if (Array.isArray(parsed.errors)) {
            parsed.errors.forEach(
                (err: { field: Path<T>; message: string }) => {
                    setError(err.field, { message: err.message });
                }
            );
        }
    } catch (e) {
        console.error('Error parsing error message:', e);
    }
}
