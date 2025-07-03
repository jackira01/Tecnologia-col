import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { laptopProductRouter } from './routes/laptopProductRouter.js';
import { salesRouter } from './routes/sales/salesRouter.js';
import { userRouter } from './routes/userRouter.js';

const { PORT, ORIGIN_ALLOWED, MONGODB_URI, ENVIROMENT } = process.env;

const server = express();

//Configure for specific origins
const whitelist = JSON.parse(ORIGIN_ALLOWED || '[]');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

if (ENVIROMENT === 'development') {
  server.use(cors()); // no necesitas '*', cors() permite todos por defecto
} else {
  server.use(cors(corsOptions));
}

//see request by console
server.use(morgan('dev'));

//parser data to json
server.use(express.json());

//routes
server.use('/laptop-product', laptopProductRouter);
server.use('/user', userRouter);
server.use('/sales', salesRouter);

//server initialization
server.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Conectado a MongoDB, escuchando en el puerto ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
