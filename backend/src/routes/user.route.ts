import express from 'express';

import {
    checkNickname,
    deleteAccount,
    getMe,
    getSuggestedUsers,
    getUserProfile,
    toggleFollow,
    updateUserProfile,
} from '../controllers/user.controller.ts';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', updateUserProfile);
router.delete('/me', deleteAccount);

router.get('/check-nickname', checkNickname);
router.get('/suggested', getSuggestedUsers);
router.post('/:id/:follow', toggleFollow);

router.get('/:nickname', getUserProfile);



export default router;
