import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './lib/db.ts';
import { connectToPostgres } from './lib/pg.ts';
import { connectRedis } from './lib/redis.ts';
import { protectRoute } from './middleware/auth.middleware.ts';
import authRoutes from './routes/auth.route.ts';
import notificationRoutes from './routes/notification.route.ts';
import postRoutes from './routes/post.route.ts';
import userRoutes from './routes/user.route.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', protectRoute, userRoutes);
app.use('/api/posts', protectRoute, postRoutes);
app.use('/api/notifications', protectRoute, notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    connectRedis();
});
