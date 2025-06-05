import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
    id: string;
    label: string;
    type?: 'text' | 'email';
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
}
export default function TextInput({ id, label, type = 'text', placeholder, register, error }: Props) {
    return (
        <div className='py-3'>
            <label htmlFor={id} className='floating-label'>
                <input
                    {...register}
                    id={id}
                    type={type}
                    placeholder={ placeholder || label }
                    className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${error ? 'border-red-500' : ''}`}
                />
                <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                    {label}
                </span>
                {error && <p className='text-sm text-red-500'>{error.message}</p>}
            </label>
        </div>
    );
}