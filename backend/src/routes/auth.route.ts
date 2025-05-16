import express, { Router } from 'express';
import {
    login,
    logout,
    refreshAccessToken,
    signup,
} from '../controllers/auth.controller.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/refresh', refreshAccessToken);

export default router;