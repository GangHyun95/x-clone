import express from 'express';

import { create, getAll, remove } from '../controllers/comment.controller.ts';
import { upload } from '../middleware/upload.middleware.ts';

const router = express.Router();

router.get('/:id', getAll);
router.post('/:id', upload.single('img'), create);
router.delete('/:id', remove);

export default router;
