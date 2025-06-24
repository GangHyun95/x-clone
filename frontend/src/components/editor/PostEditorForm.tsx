import type { LexicalEditor } from 'lexical';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { InlineSpinner } from '@/components/common/Spinner';
import { INSERT_EMOJI_COMMAND } from '@/components/editor/plugin/editorPlugins';
import { prependCommentToCache, prependPostToCache, updatePostCacheById, updatePostDetailCache } from '@/lib/queryCacheHelpers';
import { useCreate } from '@/queries/post';
import { getCurrentUser } from '@/store/authStore';
import type { Post } from '@/types/post';
import { getTweetLength } from '@/utils/formatters';

import EmojiInsertBtn from './EmojiInsertBtn';
import ImageUploadBtn from './ImageUploadBtn';
import SingleLineEditor from './SingleLineEditor';

type Props = {
    variant?: 'home' | 'modal';
    placeholder?: string;
    postId?: number;
};

export default function PostEditorForm({ variant = 'home', placeholder, postId }: Props) {
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [editor, setEditor] = useState<LexicalEditor | null>(null);

    const tweetLength = getTweetLength(currentText);
    const isDisabled = (currentText.length === 0 && !selectedImage) || tweetLength > 280;
    const isModal = variant === 'modal';

    const me = getCurrentUser();
    const { mutate: createItem, isPending } = useCreate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDisabled) return;
        
        const formData = new FormData();
        formData.append('text', currentText);
        if (selectedImage) {
            formData.append('img', selectedImage);
        }
        if (postId) {
            formData.append('parentId', postId.toString());
        }
        createItem(formData, {
            onSuccess: (newItem: Post) => {
                setSelectedImage(null);
                setImagePreviewUrl(null);
                setCurrentText('');
                setEditorKey(prev => prev + 1);

                if (!postId) {
                    prependPostToCache(newItem);
                    return;
                }

                const updater = (post: Post) => ({
                    ...post,
                    counts: {
                        ...post.counts,
                        comment: post.counts.comment + 1,
                    },
                });
                updatePostCacheById(postId, updater);
                updatePostDetailCache(postId, updater);
                prependCommentToCache(postId, newItem);

                if (isModal) navigate(-1);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    return (
        <form className={`flex flex-col px-4 ${!isModal ? 'border-b border-base-300' : ''}`} onSubmit={handleSubmit}>
            <div className={`flex ${isModal ? 'border-b border-base-300' : ''}`}>
                <div className='mr-2 pt-3'>
                    {isModal ? (
                        <Avatar src={me.profile_img} />
                    ) : (
                        <Avatar src={me.profile_img} username={me.username} />
                    )}
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor
                        key={editorKey}
                        onChangeText={setCurrentText}
                        placeholder={placeholder}
                        isModal={isModal}
                        onEditorInit={setEditor}
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
                            if (editor) {
                                editor.dispatchCommand(INSERT_EMOJI_COMMAND, emoji);
                            }
                        }}
                    />
                </div>
                <div className='flex items-center ml-4 mt-2'>
                    <span className={`text-sm ${tweetLength> 280 ? 'text-error' : 'text-gray-500'} mr-4`}>
                        {tweetLength}/280
                    </span>
                    <button
                        type='submit'
                        className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                        disabled={isDisabled || isPending}
                    >
                        {isPending ? <InlineSpinner label={postId ? 'Replying' : 'Posting'} /> : <span>{postId ? 'Reply' : 'Post'}</span>}
                    </button>
                </div>
            </footer>
        </form>
    );
}
