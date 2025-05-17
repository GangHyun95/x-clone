import express from 'express';
import {
    commentOnPost,
    createPost,
    deletePost,
    editPost,
    likeUnlikePost,
} from '../controllers/post.controller.ts';

const router = express.Router();

router.post('/', createPost);
router.patch('/:id', editPost);
router.delete('/:id', deletePost);
router.post('/:id/comment', commentOnPost);
router.post('/:id/like', likeUnlikePost);

export default router;
