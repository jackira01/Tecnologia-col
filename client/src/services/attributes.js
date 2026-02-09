import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtener atributos con paginación
 */
export const getAttributes = async (datapost) => {
  const { data } = await axios.post(
    `${API_URL}/attributes/?page=${datapost.page}&limit=${datapost.limit}`,
    datapost.filters,
  );
  return data;
};

/**
 * Obtener atributos por categoría (para selects dinámicos)
 */
export const getAttributesByCategory = async (category) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/attributes/category/${category}`,
    );
    return data;
  } catch (error) {
    console.error(`Error obteniendo atributos de ${category}:`, error);
    return [];
  }
};

/**
 * Crear nuevo atributo
 */
export const createAttribute = async (dataObj) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attributes/create`,
      dataObj,
    );
    toast.success(data.message);
    return data.attribute;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al crear atributo';
    toast.error(message);
    throw error;
  }
};

/**
 * Actualizar atributo existente
 */
export const updateAttribute = async (dataObj) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/attributes/update/${dataObj._id}`,
      dataObj,
    );
    toast.success(data.message);
    return data.attribute;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar atributo';
    toast.error(message);
    throw error;
  }
};

/**
 * Eliminar atributo (soft delete)
 */
export const deleteAttribute = async (id) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/attributes/delete/${id}`,
    );
    toast.success(data.message);
    return data;
  } catch (error) {
    toast.error('Error al eliminar atributo');
    throw error;
  }
};

/**
 * Eliminar permanentemente un atributo
 */
export const hardDeleteAttribute = async (id) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/attributes/delete-permanent/${id}`,
    );
    toast.success(data.message);
    return data;
  } catch (error) {
    toast.error('Error al eliminar atributo permanentemente');
    throw error;
  }
};
