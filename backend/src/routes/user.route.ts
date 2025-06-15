import express from 'express';

import {
    checkNickname,
    deleteAccount,
    getMe,
    getSuggestedUsers,
    getUserPosts,
    getUserProfile,
    toggleFollow,
    updateUserProfile,
} from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), updateUserProfile);
router.delete('/me', deleteAccount);

router.get('/check-nickname', checkNickname);
router.get('/suggested', getSuggestedUsers);
router.post('/:id/follow', toggleFollow);
router.get('/:nickname/posts', getUserPosts);

router.get('/profile/:nickname', getUserProfile);



export default router;
