"use client";

import CardsComponent from "@/components/CardComponent/CardsComponent";
import SideBarComponent from "@/components/SideBar/SideBarComponent";
import { ProductContext } from "@/context/productContext";
import { getProducts } from "@/services/products";
import { Spinner } from "flowbite-react";
import { useContext, useEffect } from "react";

const catalogoPage = () => {
	const { setProducts, loaderProducts, setLoaderProducts } =
		useContext(ProductContext);

	return (
		<>
			{loaderProducts ? (
				<div className="flex mt-5 max-w-[1024px] h-[90vh] justify-center items-center">
					<Spinner size="xl" />
					<h1 className="text-lg text-white font-semibold mx-2">
						Cargando Productos
					</h1>
				</div>
			) : (
				<div className="flex mt-5 max-w-[1024px] h-[90vh]">
					<SideBarComponent className="bg-[#31363F]" />
					<CardsComponent />
				</div>
			)}
		</>
	);
};

export default catalogoPage;
