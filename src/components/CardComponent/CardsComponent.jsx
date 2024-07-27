import { ProductContext } from "@/context/productContext";
import { useContext } from "react";
const { default: CardComponent } = require("./CardComponent");

const CardsComponent = () => {
    const { products } = useContext(ProductContext);
	return (
		<div className=" grid gap-10 grid-cols-1 place-items-center w-screen md:grid-cols-2 lg:grid-cols-3 ">
			{products.map((card) => (
				/* Arreglar el tamaño maximo y minimo de la card */
				<CardComponent key={card._id} data={card} />
			))}
		</div>
	);
};

export default CardsComponent