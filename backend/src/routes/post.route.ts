import express from 'express';

import {
    commentOnPost,
    createPost,
    deletePost,
    editPost,
    getAllPosts,
    getFollowingPosts,
    getLikedPosts,
    getUserPosts,
    likeUnlikePost,
} from '../controllers/post.controller.ts';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/following', getFollowingPosts);
router.get('/:id/likes', getLikedPosts);
router.get('/:nickname', getUserPosts);
router.post('/', createPost);
router.patch('/:id', editPost);
router.delete('/:id', deletePost);
router.post('/:id/comment', commentOnPost);
router.post('/:id/like', likeUnlikePost);

export default router;
