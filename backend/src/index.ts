import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './lib/db/index.ts';
import { connectRedis } from './lib/redis.ts';
import { protectRoute } from './middleware/auth.middleware.ts';
import authRoutes from './routes/auth.route.ts';
import notificationRoutes from './routes/notification.route.ts';
import postRoutes from './routes/post.route.ts';
import userRoutes from './routes/user.route.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();
const allowedOrigins = [
    'https://clone-x.xyz',
    'https://www.clone-x.xyz',
    'http://localhost:5173',
];


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', protectRoute, userRoutes);
app.use('/api/posts', protectRoute, postRoutes);
app.use('/api/notifications', protectRoute, notificationRoutes);

app.get('/env.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        window.__ENV__ = {
            KAKAO_CLIENT_ID: "${process.env.KAKAO_CLIENT_ID}",
            KAKAO_REDIRECT_URI: "${process.env.KAKAO_REDIRECT_URI}",
            GOOGLE_CLIENT_ID: "${process.env.GOOGLE_CLIENT_ID}",
            GOOGLE_REDIRECT_URI: "${process.env.GOOGLE_REDIRECT_URI}",
        };
    `);
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    connectRedis();
});
