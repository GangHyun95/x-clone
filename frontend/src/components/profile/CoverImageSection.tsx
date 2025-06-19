import { useId, useState } from 'react';

import { CarmeraSvg } from '@/components/svgs';

type Props = {
    src: string;
    editable?: boolean;
    onChange?: (file: File) => void;
};

export default function CoverImageSection({ src, editable = false, onChange }: Props) {
    const inputId = useId();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!editable) {
        return (
            <div className='relative bg-slate-300 z-0'>
                <div className='pb-[calc(100%/3)]' />
                <div className='absolute inset-0 overflow-hidden'>
                    {src && (
                        <img
                            src={src}
                            alt='cover'
                            className='absolute w-full h-full object-cover'
                        />
                    )}
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
        <div className='relative bg-slate-300 z-0'>
            <div className='pb-[calc(100%/3)]' />
            <div className='absolute inset-0 overflow-hidden'>
                {(previewUrl || src) && (
                    <img
                        src={previewUrl ?? src}
                        alt='cover'
                        className='absolute w-full h-full object-cover'
                    />
                )}
                <div className='absolute w-full h-full flex justify-center items-center'>
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
    );
}
