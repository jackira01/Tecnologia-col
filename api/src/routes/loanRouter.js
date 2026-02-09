import { Router } from 'express';
import {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  simulatePayment,
} from '../controllers/loan/loanController.js';

const loanRouter = Router();

// CRUD routes
loanRouter.post('/', createLoan);
loanRouter.get('/', getAllLoans);
loanRouter.get('/:id', getLoanById);
loanRouter.put('/:id', updateLoan);
loanRouter.delete('/:id', deleteLoan);

// Simulation route
loanRouter.post('/simulate', simulatePayment);

export { loanRouter };
