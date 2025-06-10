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

export const createProducts = async (dataObj) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/laptop-product/create`,
      dataObj,
    );
    toast.success(data.message);
    return data.product;
  } catch (error) {
    toast.error('Ups! Algo paso...');
  }
};

export const updateProducts = async (dataObj) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/laptop-product/update/${dataObj._id}`,
      dataObj,
    );
    toast.success(data.message);
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Ups! Algo paso...');
  }
};
