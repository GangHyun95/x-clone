import express from 'express';
import {
    checkNickname,
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile,
} from '../controllers/user.controller.ts';

const router = express.Router();

router.get('/profile/:nickname', getUserProfile);
router.get('/suggested', getSuggestedUsers);
router.post('/follow/:id', followUnfollowUser);
router.post('/update', updateUserProfile);
router.post('/check-nickname/:nickname', checkNickname);

export default router;
