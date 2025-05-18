import express, { Router } from 'express';
import {
    getGoogleClientId,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    signup,
} from '../controllers/auth.controller.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleLogin);
router.get('/google', getGoogleClientId);

router.post('/refresh', refreshAccessToken);

export default router;