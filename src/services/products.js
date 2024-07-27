import axios from "axios"
import toast from "react-hot-toast";

export const getProducts = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product`)
        return response.data.laptops
    } catch (error) {
        console.log(error);
        return error
    }
}

export const createProducts = async () => {
    return toast.promise(axios.post(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/create`, data, {
        withCredentials: true,
    }), {
        loading: 'Creando Cita...',
        success: (response) => response.data.message,
        error: (error) => {
            if (error.response) {
                return error.response.data.message;
            }
            return error.message;
        },
    })

}