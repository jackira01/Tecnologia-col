import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const createExpense = async (data) => {
  const response = await axios.post(`${API_URL}/expense`, data);
  return response.data;
};

export const getAllExpenses = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/expense`, { params: filters });
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await axios.get(`${API_URL}/expense/${id}`);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await axios.put(`${API_URL}/expense/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/expense/${id}`);
  return response.data;
};

export const getMonthlyExpenses = async (month, year) => {
  const response = await axios.get(`${API_URL}/expense/monthly`, {
    params: { month, year },
  });
  return response.data;
};
