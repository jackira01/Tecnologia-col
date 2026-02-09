import { Router } from 'express';
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyExpenses,
} from '../controllers/expense/expenseController.js';

const expenseRouter = Router();

// CRUD routes
expenseRouter.post('/', createExpense);
expenseRouter.get('/', getAllExpenses);
expenseRouter.get('/monthly', getMonthlyExpenses);
expenseRouter.get('/:id', getExpenseById);
expenseRouter.put('/:id', updateExpense);
expenseRouter.delete('/:id', deleteExpense);

export { expenseRouter };
