import { Router } from 'express';
import { postTransaction } from '../controllers/transaction/postTransaction.js';
import { getTransactions } from '../controllers/transaction/getTransactions.js';

export const transactionRouter = Router();

transactionRouter.post('/', postTransaction);
transactionRouter.get('/', getTransactions);
