import express from 'express';

import {
    bookmarkPost,
    commentOnPost,
    createPost,
    deletePost,
    editPost,
    getAllPosts,
    getFollowingPosts,
    getLikedPosts,
    getUserPosts,
    likePost,
} from '../controllers/post.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/following', getFollowingPosts);
router.get('/:id/likes', getLikedPosts);
router.get('/:nickname', getUserPosts);
router.post('/', upload.single('img'), createPost);
router.patch('/:id', editPost);
router.delete('/:id', deletePost);
router.post('/:id/comment', commentOnPost);
router.post('/:id/like', likePost);
router.post('/:id/bookmark', bookmarkPost);

export default router;
