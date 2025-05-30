import express from 'express';

import {
    checkEmailExists,
    getGoogleClientId,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    sendEmailCode,
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

router.post('/email-code', sendEmailCode);
router.post('/email-code/verify', verifyEmailCode);
router.get('/email/check', checkEmailExists);

export default router;
