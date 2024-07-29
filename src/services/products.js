import axios from "axios"
import toast from "react-hot-toast";

export const getProducts = async (page) => {
    const newPage = page ? page : 1
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/?page=${newPage}`)
        return response.data
    } catch (error) {
        console.log(error);
        return error
    }
}

export const createProducts = async (data) => {
    return toast.promise(axios.post(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/create`, data), {
        loading: 'Creando Producto...',
        success: (response) => response.data.message,
        error: (error) => {
            if (error.response) {
                return error.response.data.message;
            }
            return error.message;
        },
    })

}