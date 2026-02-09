import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLeads = async ({ page, limit, status }) => {
  try {
    const statusParam = status ? `&status=${status}` : '';
    const { data } = await axios.get(
      `${API_URL}/leads?page=${page}&limit=${limit}${statusParam}`,
    );
    return data;
  } catch (error) {
    toast.error('Error al obtener leads');
    throw error;
  }
};

export const createLead = async (leadData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/leads/create`,
      leadData,
    );
    toast.success('Lead creado exitosamente');
    return data;
  } catch (error) {
    toast.error('Error al crear lead');
    throw error;
  }
};

export const updateLead = async (leadId, leadData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/leads/update/${leadId}`,
      leadData,
    );
    toast.success('Lead actualizado exitosamente');
    return data;
  } catch (error) {
    toast.error('Error al actualizar lead');
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/leads/matches`);
    return data;
  } catch (error) {
    console.error('Error al obtener matches:', error);
    toast.error('Error al obtener matches');
    return [];
  }
};
