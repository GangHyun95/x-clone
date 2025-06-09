import { useId } from 'react';

import { MediaSvg } from '@/components/svgs';

type Props = {
    onUploadComplete: (file: File, previewUrl: string) => void;
}

export default function ImageUploadBtn({ onUploadComplete }: Props) {
    const inputId = useId();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        onUploadComplete(file, previewUrl);
    };
    return (
        <>
            <label
                htmlFor={inputId}
                className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                title='Add image'
            >
                <MediaSvg className='w-5 fill-primary' />
            </label>
            <input
                id={inputId}
                type='file'
                accept='image/*'
                onChange={handleChange}
                className='hidden'
            />
        </>
    );
}
