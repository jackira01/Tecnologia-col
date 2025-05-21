import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/user/auth_google`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
