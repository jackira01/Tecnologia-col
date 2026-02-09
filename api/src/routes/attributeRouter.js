import { Router } from 'express';
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  hardDeleteAttribute,
  getAttributesByCategory,
} from '../controllers/attribute/attributeController.js';

export const attributeRouter = Router();

// Obtener atributos con paginación
attributeRouter.post('/', getAttributes);

// Obtener atributos por categoría (para selects)
attributeRouter.get('/category/:category', getAttributesByCategory);

// Crear nuevo atributo
attributeRouter.post('/create', createAttribute);

// Actualizar atributo
attributeRouter.post('/update/:id', updateAttribute);

// Soft delete
attributeRouter.delete('/delete/:id', deleteAttribute);

// Hard delete (permanente)
attributeRouter.delete('/delete-permanent/:id', hardDeleteAttribute);
