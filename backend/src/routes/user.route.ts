import express from 'express';

import {
    checkNickname,
    deleteAccount,
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile,
} from '@/controllers/user.controller.ts';

const router = express.Router();

router.get('/:nickname', getUserProfile);
router.get('/suggested', getSuggestedUsers);
router.post('/:id/:follow', followUnfollowUser);

router.get('/check-nickname', checkNickname);

router.patch('/me', updateUserProfile);
router.delete('/me', deleteAccount);

export default router;
