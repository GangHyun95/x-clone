import { useId, useState } from 'react';

import { CarmeraSvg } from '@/components/svgs';

type Props = {
    src: string;
    editable?: boolean;
    onChange?: (file: File) => void;
};

export default function ProfileImageSection({ src, editable = false, onChange }: Props) {
    const inputId = useId();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!editable) {
        return (
            <div className='relative w-1/4 max-w-32 min-w-12 -mt-[15%] mb-3'>
                <div className='pb-[100%] w-full'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='relative group rounded-full bg-white p-1'>
                            <div className='relative rounded-full overflow-hidden w-full h-full'>
                                <img
                                    src={src || '/avatar-placeholder.png'}
                                    alt='avatar'
                                    className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange?.(file);
    };

    return (
        <div className='relative w-1/4 max-w-32 min-w-12 -mt-[15%] mb-3'>
            <div className='pb-[100%] w-full'>
                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='relative group rounded-full bg-white p-1'>
                        <div className='relative rounded-full overflow-hidden w-full h-full'>
                            <img
                                src={(previewUrl ?? src) || '/avatar-placeholder.png'}
                                alt='avatar'
                                className='w-full h-full object-cover'
                            />
                            <div className='absolute inset-0 flex justify-center items-center'>
                                <label
                                    htmlFor={inputId}
                                    className='z-10 btn btn-sm btn-circle hover:bg-black/40 border-0 min-w-11 min-h-11 backdrop-blur-xs bg-black/50'
                                >
                                    <CarmeraSvg className='w-5.5 h-5.5 fill-white' />
                                </label>
                                <input
                                    id={inputId}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleChange}
                                    className='hidden'
                                />
                            </div>
                            <div className='absolute inset-0 bg-black/20 opacity-100' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
