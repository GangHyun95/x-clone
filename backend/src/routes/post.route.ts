import express from 'express';
import { createPost, deletePost, editPost } from '../controllers/post.controller.ts';

const router = express.Router();

router.post('/', createPost);
router.patch('/:id', editPost);
router.delete('/:id', deletePost);
export default router;