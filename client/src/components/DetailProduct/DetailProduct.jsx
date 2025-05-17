'use client';

import { ProductContext } from '@/context/productContext';
import { Button } from 'flowbite-react';
import { useContext } from 'react';
import CarouselComponent from './carousel/CarouselComponent';

const DetailProduct = () => {
	const { currentProduct } = useContext(ProductContext);

	return (
		<section className="py-8 md:py-16 antialiased">
			<div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
				<div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
					<CarouselComponent images={currentProduct.image_URL} />

					<div className="mt-6 sm:mt-8 lg:mt-0">
						<div>

							{
								currentProduct?.sale_status === 'vendido' ? (
									<span className="text-red-500 font-bold">Vendido</span>
								) : (
									<span className="text-green-500 font-bold">Disponible</span>)
							}


							<span className="text-sm font-semibold text-gray-500 dark:text-gray-400">

							</span>
						</div>
						<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
							{currentProduct?.name}
						</h1>
						<div className="mt-4 sm:items-center sm:gap-4 sm:flex" />

						<div className="mt-8">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Especificaciones Técnicas
							</h2>
							<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 dark:text-gray-300 text-sm">
								<li>
									<span className="font-semibold">Sistema Operativo:</span>{' '}
									{currentProduct?.specification.so}
								</li>
								<li>
									<span className="font-semibold">Marca:</span>{' '}
									{currentProduct?.specification.brand}
								</li>
								<li>
									<span className="font-semibold">Pantalla:</span>{' '}
									{currentProduct?.specification.screen_size}"
								</li>
								<li>
									<span className="font-semibold">Batería:</span>{' '}
									{currentProduct?.specification.battery ? 'Sí' : 'No'}
								</li>
								<li>
									<span className="font-semibold">Cargador:</span>{' '}
									{currentProduct?.specification.charger ? 'Sí' : 'No'}
								</li>
								<li>
									<span className="font-semibold">RAM:</span>{' '}
									{currentProduct?.specification.ram.ram_size}{' '}
									{currentProduct?.specification.ram.ram_type}
								</li>
								<li>
									<span className="font-semibold">Almacenamiento:</span>{' '}
									{currentProduct?.specification.storage.size}{' '}
									{currentProduct?.specification.storage.storage_type}
								</li>
								<li>
									<span className="font-semibold">Procesador:</span>{' '}
									{currentProduct?.specification.processor.brand}{' '}
									{currentProduct?.specification.processor.model}
								</li>

								<li>
									<a
										href={currentProduct?.specification.specification_URL}
										className="text-blue-500 hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										Equipos de referencia
									</a>
								</li>
								<li className="col-span-2">
									<span className="font-semibold">Descripción general:</span>{' '}
									{currentProduct?.specification.general_description}
								</li>
							</ul>
						</div>

						<div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
							<Button>whatsapp</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DetailProduct;
