import express from 'express';

import {
    changePassword,
    deleteAccount,
    getMe,
    getProfile,
    getSuggested,
    toggleFollow,
    updateUsername,
    updateProfile,
    getRecommended,
    getFollowers,
    getFollowing,
} from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), updateProfile);
router.patch('/me/username', updateUsername);
router.patch('/me/password', changePassword);
router.post('/me/delete', deleteAccount);

router.get('/suggested', getSuggested);
router.get('/recommended', getRecommended);

router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);
router.post('/:id/follow', toggleFollow);

router.get('/profile/:username', getProfile);



export default router;
