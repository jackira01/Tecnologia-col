import { Card } from "flowbite-react";
import { RiRam2Line } from "react-icons/ri";
import { HiMiniCpuChip } from "react-icons/hi2";
import { BsDeviceHdd } from "react-icons/bs";

const CardComponent = ({data}) => {
	return (
		<Card
			key={data.id}
			className="max-w-sm"
			imgAlt="Meaningful alt text for an image that is not purely decorative"
			imgSrc={data.imageURL}
		>
			<h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
				{data.name}
			</h2>
			<h2 className="text-base font-serif font-bold tracking-tight text-gray-900 dark:text-white">
				Lenovo
			</h2>
			<div className="flex">
				<RiRam2Line className="mr-2" fontSize={25} />
				<p>
					Ram <strong>{data.ram.size}</strong> {data.ram.type}
				</p>
			</div>
			<div className="flex">
				<BsDeviceHdd className="mr-2" fontSize={25} />
				<p>
					Almacen <strong>{data.storage.size}</strong> {data.storage.type}
				</p>
			</div>
			<div className="flex">
				<HiMiniCpuChip className="mr-2" fontSize={25} />
				<p>{data.cpu}</p>
			</div>
		</Card>
	);
};

export default CardComponent