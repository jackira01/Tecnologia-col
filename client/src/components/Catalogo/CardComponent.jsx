import { Card } from 'flowbite-react';
import Link from 'next/link';
import { BsDeviceHdd } from 'react-icons/bs';
import { HiMiniCpuChip } from 'react-icons/hi2';
import { RiRam2Line } from 'react-icons/ri';

export const CardComponent = ({ data }) => {
	const SpecItem = ({ icon, text }) => (
		<div className="flex items-center">
			<span className="mr-2 text-gray-600 dark:text-gray-400">{icon}</span>
			<span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
		</div>
	);

	console.log(data);

	return (
		<Card
			className="h-full w-full min-w-[250px] max-w-[300px] border-none bg-white shadow-md dark:bg-gray-800"
			imgSrc={data.image}
			imgAlt={data.name}
		>
			<div className="flex h-full flex-col justify-between p-4">
				<div>
					<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white ">
						{data.name}
					</h5>
					<p className="mb-3 font-bold text-gray-700 dark:text-gray-300">
						${data.price.sale}
					</p>

					{/* Tus especificaciones (iconos + texto) */}
					<div className="space-y-2">
						<SpecItem
							icon={<RiRam2Line />}
							text={`RAM ${data.specification.ram.size} ${data.specification.ram.ram_type}`}
						/>
						<SpecItem
							icon={<BsDeviceHdd />}
							text={`Almacenamiento ${data.specification.storage.size} ${data.specification.storage.storage_type}`}
						/>
						<SpecItem
							icon={<HiMiniCpuChip />}
							text={`${data.specification.processor.brand} ${data.specification.processor.model}`}
						/>
					</div>
				</div>

				<Link
					href={`/${data.id}`}
					className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Ver detalles
				</Link>
			</div>
		</Card>
	);
};
