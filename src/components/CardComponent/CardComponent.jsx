import { Button, Card } from "flowbite-react";
import { RiRam2Line } from "react-icons/ri";
import { HiMiniCpuChip } from "react-icons/hi2";
import { BsDeviceHdd } from "react-icons/bs";
import Link from "next/link";

const CardComponent = ({ data }) => {
	return (
		<Card
			key={data._id}
			className="max-w-sm border-none font-sans text-mainDark-white w-[278px] min-h-[520px]"
			imgAlt="Meaningful alt text for an image that is not purely decorative"
			imgSrc={data.image}
		>
			<h2 className="text-lg font-bold tracking-tight text-mainDark-text">
				{data.name}
			</h2>
			<h2 className="text-xl font-serif font-bold">${data.price.sale}</h2>
			<div className="flex">
				<RiRam2Line className="mr-2" fontSize={25} />
				<p>
					Ram <strong>{data.specification.ram.size}</strong> {data.specification.ram.ram_type}
				</p>
			</div>
			<div className="flex">
				<BsDeviceHdd className="mr-2" fontSize={25} />
				<p>
					Almacen <strong>{data.specification.storage.size}</strong> {data.specification.storage.storage_type}
				</p>
			</div>
			<div className="flex">
				<HiMiniCpuChip className="mr-2" fontSize={25} />
				<p>{data.specification.processor.brand} {data.specification.processor.model}</p> 
			</div>

			<div className="flex justify-center items-center">
				<Link
					href={`/catalogo/${data.id}`}
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>
					Detalles
				</Link>
			</div>
		</Card>
	);
};

export default CardComponent;
