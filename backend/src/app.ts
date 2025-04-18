import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1', routes);

app.use(errorHandler); // custom error handler

export default app;
