import { Router } from 'express';
import { getProduct } from '../controllers/product/getProduct.js';
import { postProduct } from '../controllers/product/postProduct.js';
import { putProduct } from '../controllers/product/putProduct.js';

export const laptopProductRouter = Router();

laptopProductRouter.post('/', getProduct);
laptopProductRouter.post('/create', postProduct);
laptopProductRouter.post('/update/:id', putProduct);
