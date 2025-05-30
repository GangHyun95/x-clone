import express from 'express';

import { deleteNotification, deleteNotifications, getNotifications } from '../controllers/notification.controller.ts';

const router = express.Router();

router.get('/', getNotifications);
router.delete('/', deleteNotifications);
router.delete('/:id/', deleteNotification);


export default router;
