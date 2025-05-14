'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { Pagination, Spinner } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';

export const ProductPagination = () => {
	const { setProducts, totalPages, loaderProducts, setLoaderProducts } =
		useContext(ProductContext);
	const [currentPage, setCurrentPage] = useState(1);

	const onPageChange = async (page) => {
		setLoaderProducts(true);
		const response = await getProducts(page);
		await setProducts(response.docs);
		setCurrentPage(response.page);
		setLoaderProducts(false);
	};

	return (
		<div className="col-span-3 mt-10 flex w-full items-center justify-center">
			{loaderProducts ? (
				<Spinner size="md" />
			) : (
				<div className="flex flex-col justify-end">
					<p className="text-white ml-10">
						pagina <strong>{currentPage}</strong> de{' '}
						<strong>{totalPages}</strong>{' '}
					</p>
					<Pagination
						layout="navigation"
						showIcons
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</div>
			)}
		</div>
	);
};
