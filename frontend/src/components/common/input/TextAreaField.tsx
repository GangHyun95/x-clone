import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
    id: string;
    label: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    maxLength?: number;
    currentLength?: number;
};

export default function TextAreaField({ id, label, placeholder, register, error, maxLength, currentLength }: Props) {
    return (
        <div className='py-3'>
            <label htmlFor={id} className='floating-label'>
                <textarea
                    {...register}
                    id={id}
                    placeholder={placeholder || label}
                    rows={4}
                    maxLength={maxLength}
                    className={`textarea textarea-lg w-full !text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary resize-none ${error ? 'border-red-500' : ''}`}
                />
                <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                    {label}
                </span>
                {error && <p className='text-sm text-red-500'>{error.message}</p>}
            </label>
            {typeof maxLength === 'number' && typeof currentLength === 'number' && (
                <div className='text-right text-sm text-gray-500 mt-1 px-1'>
                    {currentLength}/{maxLength}
                </div>
            )}
        </div>
    );
}
