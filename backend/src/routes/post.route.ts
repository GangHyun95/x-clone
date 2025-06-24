import express from 'express';

import {
    create,
    getAll,
    getBookmarked,
    getFromFollowing,
    getLiked,
    getOne,
    remove,
    toggleBookmark,
    toggleLike,
} from '../controllers/post.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/', getAll);
router.get('/following', getFromFollowing);
router.get('/likes/:username', getLiked);
router.get('/bookmarks', getBookmarked);
router.get('/:id', getOne);

router.post('/', upload.single('img'), create);
router.delete('/:id', remove);

router.post('/:id/like', toggleLike);
router.post('/:id/bookmark', toggleBookmark);

export default router;
