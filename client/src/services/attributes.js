import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtener objeto de atributos por categoría
 * Retorna: { category: 'processors', data: { brands: [], ... } }
 */
export const getAttributesByCategory = async (category) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/attributes/category/${category}`,
    );
    return data; // Retorna el documento completo
  } catch (error) {
    console.error(`Error obteniendo atributos de ${category}:`, error);
    return { category, data: {} };
  }
};

/**
 * Agregar valor a una lista de categoría
 * payload: { category, key, value }
 */
export const addValueToCategory = async (payload) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attributes/add-value`,
      payload,
    );
    toast.success(data.message);
    return data.attribute;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al agregar valor';
    toast.error(message);
    throw error;
  }
};

/**
 * Actualizar valor de una lista de categoría
 * payload: { category, key, oldValue, newValue, newParent }
 */
export const updateValueInCategory = async (payload) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attributes/update-value`,
      payload,
    );
    toast.success(data.message);
    return data.attribute;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar valor';
    toast.error(message);
    throw error;
  }
};

/**
 * Eliminar valor de una lista de categoría
 * payload: { category, key, value }
 */
export const removeValueFromCategory = async (payload) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attributes/remove-value`,
      payload,
    );
    toast.success(data.message);
    return data.attribute;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al eliminar valor';
    toast.error(message);
    throw error;
  }
};

// Deprecated functions (kept for compatibility during transition if needed, but should not be used)
export const getAttributes = async () => [];
export const createAttribute = async () => { };
export const updateAttribute = async () => { };
export const deleteAttribute = async () => { };
