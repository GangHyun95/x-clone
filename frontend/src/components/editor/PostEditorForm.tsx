import { useState } from 'react';

import Avatar from '@/components/Avatar';
import SingleLineEditor from '@/components/editor/SingleLineEditor';
import { EmojiSvg, MediaSvg } from '@/components/svgs';

type Props = {
    profileImg: string;
    variant?: 'home' | 'modal';
};

export default function PostEditorForm({ profileImg, variant = 'home' }: Props) {
    const [text, setText] = useState('');
    const isModal = variant === 'modal';
    const isDisabled = text.trim().length === 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form className={`flex flex-col px-4 ${!isModal && 'border-b border-base-300'}`} onSubmit={handleSubmit}>
            <div className={`flex px-4 ${isModal && 'border-b border-base-300'} `}>
                <div className='mr-2 pt-3'>
                    <Avatar src={profileImg} />
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor
                        isModal={isModal}
                        onTextChange={setText}
                    />
                </div>
            </div>

            <footer className='flex items-center justify-between pb-2'>
                <div className='mt-2 grow'>
                    <button
                        type='button'
                        className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                    >
                        <MediaSvg className='w-5 fill-primary' />
                    </button>
                    <button
                        type='button'
                        className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                    >
                        <EmojiSvg className='w-5 fill-primary' />
                    </button>
                </div>
                <div className='ml-4 mt-2'>
                    <button
                        type='submit'
                        className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                        disabled={isDisabled}
                    >
                        Post
                    </button>
                </div>
            </footer>
        </form>
    );
}
