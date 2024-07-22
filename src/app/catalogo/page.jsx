import CardComponent from "@/components/CardComponent/CardComponent";
import SideBarComponent from "@/components/SideBar/SideBarComponent";
import { initialValues } from "@/utils";

const catalogo = () => {
	return (
		<div className="flex mt-5">
			<SideBarComponent />
			<div className="gap-10 grid grid-cols-3 h-[90%] w-screen mx-[12%]">
				{initialValues.map((card) => (
					/* Arreglar el tamaño maximo y minimo de la card */
					<CardComponent key={card.id} data={card} />
				))}
			</div>
		</div>
	);
};

export default catalogo;
