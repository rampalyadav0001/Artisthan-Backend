import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('Public'));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter);

import productRouter from './routes/product.routes.js';
app.use('/api/v1/products', productRouter);

import aritsanRouter from './routes/artisan.routes.js';
app.use('/api/v1/artisan', aritsanRouter);

export default app;
