import { EditorState } from 'draft-js';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { InlineSpinner } from '@/components/common/Spinner';
import { prependPostToCache, updatePostCacheById } from '@/lib/queryCacheHelpers';
import { useCreate } from '@/queries/post';
import { getCurrentUser } from '@/store/authStore';
import type { Post } from '@/types/post';

import EmojiInsertBtn from './EmojiInsertBtn';
import ImageUploadBtn from './ImageUploadBtn';
import SingleLineEditor, { insertEmoji } from './SingleLineEditor';

type Props = {
    variant?: 'home' | 'modal';
    placeholder?: string;
    postId?: number;
};

export default function PostEditorForm({ variant = 'home', placeholder, postId }: Props) {
    const navigate = useNavigate();

    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const isModal = variant === 'modal';
    const isDisabled = text.trim().length === 0 && !selectedImage;

    const me = getCurrentUser();
    const { mutate: createPost, isPending } = useCreate(postId);

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
                setEditorState(EditorState.createEmpty());
                navigate(-1);
                if (postId) {
                        updatePostCacheById(postId, (post) => ({
                            ...post,
                            counts: {
                                ...post.counts,
                                comment: post.counts.comment + 1,
                            },
                        }));
                } else {
                    prependPostToCache(newPost);
                }
            },
            onError: (error) => {
                console.error(error);
            },
        });
        
    };

    return (
        <form className={`flex flex-col px-4 ${!isModal ? 'border-b border-base-300' : ''}`} onSubmit={handleSubmit}>
            <div className={`flex ${isModal && 'border-b border-base-300'}`}>
                <div className='mr-2 pt-3'>
                    {isModal ? (
                        <Avatar src={me.profile_img} />
                    ) : (
                        <Avatar src={me.profile_img} username={me.username} />
                    )}
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor
                        editorState={editorState}
                        setEditorState={setEditorState}
                        isModal={isModal}
                        onTextChange={setText}
                        placeholder={placeholder}
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
                    <EmojiInsertBtn
                        insertEmoji={(emoji) => {
                            const updated = insertEmoji(editorState, emoji);
                            setEditorState(updated);
                            setText(updated.getCurrentContent().getPlainText().trim());
                        }}
                    />
                </div>
                <div className='ml-4 mt-2'>
                    <button
                        type='submit'
                        className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                        disabled={isDisabled || isPending}
                    >
                        { isPending ? <InlineSpinner label='Posting' /> : <span>Post</span> }
                    </button>
                </div>
            </footer>
        </form>
    );
}
