import { Router } from 'express';
import { verifyGoogleUser } from '../controllers/user/authGoogle.js';
import { postUser, updateUser } from '../controllers/user/postUser.js';

export const userRouter = Router();

userRouter.post('/create', postUser);
userRouter.post('/update/:id', updateUser);
// userRouter.get('/auth_credentials', verifyUserCredentials);
userRouter.post('/auth_google', verifyGoogleUser);
