import { FollowButton } from '@/components/postcard/button';
import DeletePostButton from '@/components/postcard/button/DeletePostButton';
import GlobalPortal from '@/portals/GlobalPortal';
import { getCurrentUser } from '@/store/authStore';
import type { UserPreview } from '@/types/user';

type Props = {
    open: boolean;
    position: Partial<{
        top: number;
        bottom: number;
        left: number;
        right: number;
    }>;
    onClose: () => void;
    user: UserPreview;
    postId: number;
};

export default function PostMenuDropDown({ open, position, onClose, user, postId }: Props) {
    const { id: postAuthorId, is_following, nickname } = user;

    const { id: currentUserId } = getCurrentUser();
    const isOwner = currentUserId === postAuthorId;

    return (
        <GlobalPortal>
            {open && (
                <div className='absolute inset-0 z-10'>
                    <div className='fixed inset-0 z-0' onClick={onClose} />

                    <div
                        className='absolute z-0 w-[300px] rounded-2xl bg-white border border-base-300 shadow-md overflow-hidden'
                        style={position}
                    >
                        <div className='flex flex-col'>
                            {isOwner && (
                                <DeletePostButton
                                    postId={postId}
                                    onClose={onClose}
                                />
                            )}
                            {!isOwner && (
                                <FollowButton
                                    postAuthorId={postAuthorId}
                                    is_following={is_following}
                                    nickname={nickname}
                                    onClose={onClose}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </GlobalPortal>
    );
}
