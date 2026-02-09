import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtener insights de rentabilidad
 */
export const getProfitabilityInsights = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/insights/profitability`);
    return data;
  } catch (error) {
    console.error('Error obteniendo insights:', error);
    toast.error('No se pudo obtener el análisis de rentabilidad');
    return null;
  }
};

/**
 * Obtener estadísticas generales de ventas
 */
export const getSalesStats = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/insights/stats`);
    return data;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    toast.error('No se pudo obtener las estadísticas');
    return null;
  }
};
