import { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import { EyeSvg } from '@/components/svgs';

type Props = {
    id: string;
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
};
export default function PasswordInput({ id, label, register, error }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='py-3 relative'>
            <label htmlFor={id} className='floating-label'>
                <input
                    {...register}
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={label}
                    className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary pr-10 ${
                        error ? 'border-red-500' : ''
                    }`}
                />
                <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                    {label}
                </span>
                {error && <p className='text-sm text-red-500'>{error.message}</p>}
            </label>
            <div
                className='absolute right-3 top-1/2 -translate-y-1/2 z-10 text-xl cursor-pointer'
                onClick={() => setShowPassword(prev => !prev)}
            >
                <EyeSvg visible={showPassword} className='w-5' />
            </div>
        </div>
    );
}
