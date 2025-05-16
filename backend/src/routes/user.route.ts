import express from 'express';
import { followUnfollowUser, getUserProfile } from '../controllers/user.controller.ts';

const router = express.Router();

router.get("/profile/:nickname", getUserProfile);
router.post("/follow/:id", followUnfollowUser);


export default router;