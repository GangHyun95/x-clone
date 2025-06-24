import express from 'express';

import { getNotifications } from '../controllers/notification.controller.ts';

const router = express.Router();

router.get('/', getNotifications);


export default router;
