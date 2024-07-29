"use client";

import { getProducts } from "@/services/products";
import { defaultValuesForm } from "@/utils";
import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
	const [initialFormValues, setInitialFormValues] = useState(defaultValuesForm);
	const [isEdit, setIsEdit] = useState(false);
	const [products, setProducts] = useState([]);
	const [loaderProducts, setLoaderProducts] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoaderProducts(true);
			const response = await getProducts();
			setTotalPages(response.totalPages);
			setProducts(response.docs);
			setLoaderProducts(false);
		};
		fetchProducts();
	}, []);

	return (
		<ProductContext.Provider
			value={{
				products,
				setProducts,
				loaderProducts,
				setLoaderProducts,
				openModal,
				setOpenModal,
				totalPages,
				setTotalPages,
				initialFormValues,
				setInitialFormValues,
				isEdit,
				setIsEdit,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};
