import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import userRouter from "./routes/user.route.js";

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', userRouter);

export default app;