import express from 'express';

import { create } from '../controllers/comment.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.post('/:id', upload.single('img'), create);

export default router;