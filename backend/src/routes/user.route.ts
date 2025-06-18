import express from 'express';

import {
    changePassword,
    deleteAccount,
    getMe,
    getPosts,
    getProfile,
    getSuggested,
    toggleFollow,
    updateUsername,
    updateProfile,
} from '../controllers/user.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), updateProfile);
router.patch('/me/username', updateUsername);
router.patch('/me/password', changePassword);
router.post('/me/delete', deleteAccount);

router.get('/suggested', getSuggested);
router.post('/:id/follow', toggleFollow);
router.get('/:username/posts', getPosts);

router.get('/profile/:username', getProfile);



export default router;
