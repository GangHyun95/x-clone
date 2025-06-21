import { useMatch } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PostBody from '@/components/postcard/PostBody';
import { CloseSvg } from '@/components/svgs';
import RouteModal from '@/layouts/RouteModal';
import { usePost } from '@/queries/post';

export default function NewCommentModal() {
    const match = useMatch('/comment/new/:id');
    const postId = Number(match?.params.id);
    const { data: post, isLoading } = usePost(postId);

    if (isLoading || !post) return null;
    return (
        <RouteModal position='start'>
            <div
                className={`
                    relative modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none top-[5%]
                    md:min-w-[600px] md:h-auto md:max-h-[90vh] md:rounded-2xl md:max-w-[600px]
                `}
            >

                <header className='flex h-14 justify-center px-4'>
                    <form
                        method='dialog'
                        className='flex flex-1 basis-1/2 items-center'
                    >
                        <button className='btn btn-ghost btn-circle border-0 font-normal'>
                            <CloseSvg className='w-5' />
                        </button>
                    </form>
                    <div className='flex flex-auto min-w-8 items-center'>
                    </div>
                    <div className='flex-1 basis-1/2 min-h-8' />
                </header>
                <article className='flex flex-col px-4 py-3'>
                    <div className='flex'>
                        <div className='flex flex-col mr-2'>
                            <Avatar username={post.user.username} src={post.user.profile_img} />
                        </div>

                        <div className='flex grow flex-col min-w-0'>
                            <PostBody
                                user={post.user}
                                content={post.content}
                                created_at={post.created_at}
                                img={post.img}
                                postId={postId}
                                variant='comment'
                            />
                        </div>
                    </div>
                    <div className=' py-4 border-b border-base-300'/>
                </article>
                <PostEditorForm variant='modal' placeholder='Post your reply' postId={postId}/>
            </div>
        </RouteModal>
    );
}
