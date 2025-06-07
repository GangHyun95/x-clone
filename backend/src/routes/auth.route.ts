import express from 'express';

import { signup, login, logout, refreshAccessToken } from '../controllers/auth.controller.ts';
import { checkEmailExists, resetPassword, sendEmailCode, verifyEmailCode } from '../controllers/email.controller.ts';
import { getGoogleClientId, googleLogin } from '../controllers/social.controller.ts';

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

router.post('/password-reset', resetPassword);

export default router;
