import axios from "axios"
import toast from "react-hot-toast";

export const getProducts = async (page) => {
    const newPage = page ? page : 1
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/?page=${newPage}`)
        return response.data
    } catch (error) {
        console.log(error.response.data.message);
        toast.error("Ups! Algo paso...")
    }
}

export const createProducts = async (data) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/create`, data)
        toast.success(response.data.message)
        return response.data.product
    } catch (error) {
        console.log(error.response.data.message);
        toast.error("Ups! Algo paso...")
    }

}

export const updateProducts = async (data) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/laptop-product/update/${data._id}`, data)
        toast.success(response.data.message)
        return response.data.product
    } catch (error) {
        console.log(error.response.data.message);
        toast.error("Ups! Algo paso...")
    }

}