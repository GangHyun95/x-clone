import { useState } from 'react';

import Avatar from '@/components/common/Avatar';
import ImageUploadBtn from '@/components/editor/ImageUploadBtn';
import SingleLineEditor from '@/components/editor/SingleLineEditor';
import { EmojiSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useCreatePost } from '@/queries/post';
import { getCurrentUser } from '@/store/authStore';
import type { Post } from '@/types/post';

type Props = {
    variant?: 'home' | 'modal';
};

export default function PostEditorForm({ variant = 'home' }: Props) {
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const isModal = variant === 'modal';
    const isDisabled = text.trim().length === 0 && !selectedImage;

    const me = getCurrentUser();
    const { mutate: createPost, isPending } = useCreatePost();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDisabled) return;
        
        const formData = new FormData();
        formData.append('text', text);
        if (selectedImage) {
            formData.append('img', selectedImage);
        }

        try {
            createPost(formData, {
                onSuccess: (newPost: Post) => {
                    setText('');
                    setSelectedImage(null);
                    setImagePreviewUrl(null);
                    queryClient.setQueryData<Post[]>(['posts'], (old) => {
                        if (!old) return [newPost];
                            return [newPost, ...old];
                        });
                    },
                    onError: (error) => {
                        console.error(error);
                    },
            });
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <form className={`flex flex-col px-4 ${!isModal && 'border-b border-base-300'}`} onSubmit={handleSubmit}>
            <div className={`flex px-4 ${isModal && 'border-b border-base-300'}`}>
                <div className='mr-2 pt-3'>
                    {isModal ? (
                        <Avatar src={me.profile_img} />
                    ) : (
                        <Avatar src={me.profile_img} nickname={me.nickname} />
                    )}
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor isModal={isModal} onTextChange={setText} />
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
                    <button
                        type='button'
                        className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                        title='Add emoji'
                    >
                        <EmojiSvg className='w-5 fill-primary' />
                    </button>
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
