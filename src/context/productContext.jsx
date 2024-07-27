"use client";

import { getProducts } from "@/services/products";
import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [loaderProducts, setLoaderProducts] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoaderProducts(true);
			const response = await getProducts();
			setProducts(response);
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
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};
