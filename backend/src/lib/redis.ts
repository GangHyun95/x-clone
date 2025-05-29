import { createClient } from 'redis';

export const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redis.connect();
        console.log('Redis Connected');
    } catch (error) {
        console.error('Failed to connect Redis:', error);
    }
}