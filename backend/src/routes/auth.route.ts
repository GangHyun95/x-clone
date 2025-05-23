import express from 'express';
import {
    getGoogleClientId,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    requestEmailVerification,
    signup,
    verifyEmailCode,
} from '../controllers/auth.controller.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/refresh', refreshAccessToken);

router.post('/google', googleLogin);
router.get('/google', getGoogleClientId);

router.post('/email-code', requestEmailVerification);
router.post('/email-code/verify', verifyEmailCode);

export default router;
