import { Router } from 'express';
import { getSalesSummary } from '../../controllers/sales/salesController.js';

export const salesRouter = Router();

// GET /api/sales/summary
salesRouter.get('/summary', getSalesSummary);
