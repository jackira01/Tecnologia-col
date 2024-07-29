import { ProductContext } from "@/context/productContext";
import { useContext, useEffect } from "react";
import { ProductPagination } from "../Pagination/ProductPagination";
import { Spinner } from "flowbite-react";
import { getProducts } from "@/services/products";
const { CardComponent } = require("./CardComponent");

export const Catalogo = () => {
	const {
		products,
		loaderProducts,
		setLoaderProducts,
		setProducts,
		setTotalPages,
	} = useContext(ProductContext);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoaderProducts(true);
			const response = await getProducts();
			setTotalPages(response.totalPages);
			setProducts(response.docs);
			setLoaderProducts(false);
		};
		fetchProducts();

		return  () => {
			setTotalPages(1);
			setProducts([]);
		  };
	}, [setLoaderProducts, setProducts, setTotalPages]);

	return (
		<div className=" grid gap-10 grid-cols-1 place-items-center w-screen md:grid-cols-2 lg:grid-cols-3">
			{loaderProducts ? (
				<Spinner />
			) : (
				products.map((card) => (
					/* Arreglar el tamaño maximo y minimo de la card */
					<CardComponent key={card._id} data={card} />
				))
			)}
			<div className="col-start-2">
				<ProductPagination />
			</div>
		</div>
	);
};
