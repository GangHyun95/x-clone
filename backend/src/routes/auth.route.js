import express from 'express';
import {
    login,
    logout,
    refreshAccessToken,
    signup,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/refresh', refreshAccessToken);

export default router;