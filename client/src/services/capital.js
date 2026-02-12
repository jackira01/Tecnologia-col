import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCapitalTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/capital`);
    return response.data;
  } catch (error) {
    console.error("Error getting capital transactions:", error);
    return { transactions: [], totalCapital: 0 };
  }
};

export const createCapitalTransaction = async (transaction) => {
  try {
    const response = await axios.post(`${API_URL}/capital`, transaction);
    return response.data;
  } catch (error) {
    console.error("Error creating capital transaction:", error);
    throw error;
  }
};
