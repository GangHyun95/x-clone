import express from 'express';

import {
    create,
    getAll,
    getBookmarked,
    getByUsername,
    getFromFollowing,
    getLiked,
    getOne,
    remove,
    toggleBookmark,
    toggleLike,
} from '../controllers/post.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/following', getFromFollowing);
router.get('/likes', getLiked);
router.get('/bookmarks', getBookmarked);
router.get('/user', getByUsername);

router.get('/:id', getOne);
router.get('/', getAll);

router.post('/', upload.single('img'), create);
router.delete('/:id', remove);

router.post('/:id/like', toggleLike);
router.post('/:id/bookmark', toggleBookmark);

export default router;
