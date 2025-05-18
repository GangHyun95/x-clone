import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.ts';
import userRoutes from './routes/user.route.ts';
import postRoutes from './routes/post.route.ts';
import notificationRoutes from './routes/notification.route.ts';
import { connectDB } from './lib/db.ts';
import { protectRoute } from './middleware/auth.middleware.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', protectRoute, userRoutes);
app.use('/api/posts', protectRoute, postRoutes);
app.use('/api/notifications',protectRoute, notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
