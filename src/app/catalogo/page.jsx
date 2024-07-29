"use client";

import { Catalogo } from "@/components/Catalogo/Catalogo";
import SideBarComponent from "@/components/SideBar/SideBarComponent";
import { ProductContext } from "@/context/productContext";
import { useContext } from "react";

const catalogoPage = () => {
	const { loaderProducts } = useContext(ProductContext);

	return (
		<div className="flex mt-5 max-w-[1024px] h-[90vh]">
			<SideBarComponent className="bg-[#31363F]" />
			<Catalogo />
		</div>
	);
};

export default catalogoPage;
