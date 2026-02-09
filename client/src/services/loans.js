import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const createLoan = async (data) => {
  const response = await axios.post(`${API_URL}/loan`, data);
  return response.data;
};

export const getAllLoans = async (activo) => {
  const params = activo !== undefined ? { activo } : {};
  const response = await axios.get(`${API_URL}/loan`, { params });
  return response.data;
};

export const getLoanById = async (id) => {
  const response = await axios.get(`${API_URL}/loan/${id}`);
  return response.data;
};

export const updateLoan = async (id, data) => {
  const response = await axios.put(`${API_URL}/loan/${id}`, data);
  return response.data;
};

export const deleteLoan = async (id) => {
  const response = await axios.delete(`${API_URL}/loan/${id}`);
  return response.data;
};

export const simulatePayment = async (loanId, extraPayment) => {
  const response = await axios.post(`${API_URL}/loan/simulate`, {
    loanId,
    extraPayment,
  });
  return response.data;
};
