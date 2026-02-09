import { Router } from 'express';
import {
  getProfitabilityInsights,
  getSalesStats,
} from '../controllers/insights/insightsController.js';

export const insightsRouter = Router();

// Obtener insights de rentabilidad
insightsRouter.get('/profitability', getProfitabilityInsights);

// Obtener estadísticas generales
insightsRouter.get('/stats', getSalesStats);
