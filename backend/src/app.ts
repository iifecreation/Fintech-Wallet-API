import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
// import './types/express';
import webhookRoutes from "./routes/webhook.routes"
import morgan from 'morgan';


dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use('/api/webhook', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', routes);

app.use(errorHandler); // custom error handler

export default app;
