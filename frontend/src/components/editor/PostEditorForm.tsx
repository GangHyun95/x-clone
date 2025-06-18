import { useState } from 'react';

import Avatar from '@/components/common/Avatar';

import { prependPostToCache } from '@/lib/queryCacheHelpers';
import { useCreate } from '@/queries/post';
import { getCurrentUser } from '@/store/authStore';
import type { Post } from '@/types/post';

import EmojiInsertBtn from './EmojiInsertBtn';
import ImageUploadBtn from './ImageUploadBtn';
import SingleLineEditor from './SingleLineEditor';

type Props = {
    variant?: 'home' | 'modal';
};

export default function PostEditorForm({ variant = 'home' }: Props) {
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [insertEmoji, setInsertEmoji] = useState<(emoji: string) => void>(() => () => {});

    const isModal = variant === 'modal';
    const isDisabled = text.trim().length === 0 && !selectedImage;

    const me = getCurrentUser();
    const { mutate: createPost, isPending } = useCreate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDisabled) return;
        
        const formData = new FormData();
        formData.append('text', text);
        if (selectedImage) {
            formData.append('img', selectedImage);
        }

        createPost(formData, {
            onSuccess: (newPost: Post) => {
                setText('');
                setSelectedImage(null);
                setImagePreviewUrl(null);
                prependPostToCache(newPost);
            },
            onError: (error) => {
                console.error(error);
            },
        });
        
    };

    return (
        <form className={`flex flex-col px-4 ${!isModal && 'border-b border-base-300'}`} onSubmit={handleSubmit}>
            <div className={`flex px-4 ${isModal && 'border-b border-base-300'}`}>
                <div className='mr-2 pt-3'>
                    {isModal ? (
                        <Avatar src={me.profile_img} />
                    ) : (
                        <Avatar src={me.profile_img} username={me.username} />
                    )}
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor
                        isModal={isModal}
                        onTextChange={setText}
                        bindInsertEmoji={(handler) =>
                            setInsertEmoji(() => handler)
                        }
                    />
                </div>
            </div>

            {imagePreviewUrl && (
                <div className='my-2 mx-4 relative'>
                    <img src={imagePreviewUrl} alt='preview' className='max-h-48 rounded-md object-contain' />
                    <button
                        type='button'
                        onClick={() => {
                            setSelectedImage(null);
                            setImagePreviewUrl(null);
                        }}
                        className='absolute top-1 right-1 btn btn-sm btn-circle btn-ghost'
                        title='Remove image'
                    >
                        ×
                    </button>
                </div>
            )}

            <footer className='flex items-center justify-between pb-2'>
                <div className='mt-2 grow flex items-center gap-2'>
                    <ImageUploadBtn 
                        onUploadComplete={(file, previewUrl) => {
                            setSelectedImage(file);
                            setImagePreviewUrl(previewUrl);
                        }}
                    />
                    <EmojiInsertBtn insertEmoji={insertEmoji} />
                </div>
                <div className='ml-4 mt-2'>
                    <button
                        type='submit'
                        className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                        disabled={isDisabled || isPending}
                    >
                        Post
                    </button>
                </div>
            </footer>
        </form>
    );
}
