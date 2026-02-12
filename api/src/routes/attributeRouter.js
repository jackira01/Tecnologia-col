import { Router } from 'express';
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getAttributesByCategory,
  addValueToCategory,
  updateValueInCategory,
  removeValueFromCategory,
} from '../controllers/attribute/attributeController.js';

export const attributeRouter = Router();

// Obtener atributos con paginación (Deprecated/Stub)
attributeRouter.post('/', getAttributes);

// Obtener atributos por categoría (para selects y visualización)
attributeRouter.get('/category/:category', getAttributesByCategory);

// Rutas nuevas para modelo agregado
attributeRouter.post('/add-value', addValueToCategory);
attributeRouter.post('/update-value', updateValueInCategory);
attributeRouter.post('/remove-value', removeValueFromCategory);

// Rutas legacy (Deprecadas)
attributeRouter.post('/create', createAttribute);
attributeRouter.post('/update/:id', updateAttribute);
attributeRouter.delete('/delete/:id', deleteAttribute);
