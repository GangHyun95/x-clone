import express from 'express';

import {
    deleteAccount,
    getMe,
    getPosts,
    getProfile,
    getSuggested,
    toggleFollow,
    updateProfile,
} from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), updateProfile);
router.delete('/me', deleteAccount);

router.get('/suggested', getSuggested);
router.post('/:id/follow', toggleFollow);
router.get('/:nickname/posts', getPosts);

router.get('/profile/:nickname', getProfile);



export default router;
