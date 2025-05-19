import { Router } from 'express';
import { postUser } from '../controllers/user/postUser.js';
import { verifyUser } from '../controllers/user/auth.js';

export const userRouter = Router();

userRouter.post('/create', postUser);
userRouter.get('/auth', verifyUser);
