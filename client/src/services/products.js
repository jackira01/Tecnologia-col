import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (datapost) => {
  const { data } = await axios.post(
    `${API_URL}/laptop-product/?page=${datapost.page}&limit=${datapost.limit}`,
    datapost.filters,
  );
  return data;
};

export const createProducts = async (data) => {
  try {
    const { data } = await axios.post(`${API_URL}/laptop-product/create`, data);
    toast.success(response.data.message);
    return data.product;
  } catch (error) {
    toast.error('Ups! Algo paso...');
  }
};

export const updateProducts = async (data) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/laptop-product/update/${data._id}`,
      data,
    );
    toast.success(data.message);
    return response.data.product;
  } catch (error) {
    toast.error('Ups! Algo paso...');
  }
};
