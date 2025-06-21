import { postFormData } from '@/service/api/client';
import type { Post } from '@/types/post';

export async function createComment(formData: FormData, postId: number) {
    const res = await postFormData<{ comment: Post }>(`/api/comments/${postId}`, formData, { withAuth: true });
    return res.data.comment;
}
