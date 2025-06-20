import { DeletePostButton, FollowButton } from '@/components/postcard/button';
import GlobalPortal from '@/portals/GlobalPortal';
import { getCurrentUser } from '@/store/authStore';
import type { UserSummary } from '@/types/user';

type Props = {
    position: Partial<{
        top: number;
        bottom: number;
        left: number;
        right: number;
    }>;
    onClose: () => void;
    user: UserSummary;
    postId: number;
};

export default function PostMenuDropDown({ position, onClose, user, postId }: Props) {
    const { id: postAuthorId, is_following, username } = user;

    const { id: currentUserId } = getCurrentUser();
    const isOwner = currentUserId === postAuthorId;

    return (
        <GlobalPortal>
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
                                username={username}
                                onClose={onClose}
                            />
                        )}
                    </div>
                </div>
            </div>
        </GlobalPortal>
    );
}
