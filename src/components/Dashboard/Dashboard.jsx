"use client";

import { Button, Spinner, Table } from "flowbite-react";
import { MdOutlineEdit } from "react-icons/md";
import { headTitle } from "./defaultValues";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "@/context/productContext";
import { parseDate } from "@/utils";
import { ProductPagination } from "../Pagination/ProductPagination";
import { getProducts } from "@/services/products";
import { IoAddCircleOutline } from "react-icons/io5";
import { ModalComponent } from "./Forms/ModalComponent";

const Dashboard = () => {
	const {
		products,
		loaderProducts,
		setLoaderProducts,
		setProducts,
		setTotalPages,
	} = useContext(ProductContext);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoaderProducts(true);
			const response = await getProducts();
			setTotalPages(response.totalPages);
			setProducts(response.docs);
			setLoaderProducts(false);
		};
		fetchProducts();

		return () => {
			setTotalPages(1);
			setProducts([]);
		};
	}, [setLoaderProducts, setProducts, setTotalPages]);

	return (
		<div className="overflow-x-auto">
			{loaderProducts ? (
				<Spinner />
			) : products.length ? (
				<>
					<div className="flex gap-2">
						<Button onClick={setOpenModal}>
							<IoAddCircleOutline size={20} className="mx-2"/>
							Crear Producto
						</Button>
						<Button>DEMO</Button>
					</div>
					<Table hoverable>
						<Table.Head>
							{headTitle.map((value) => (
								<Table.HeadCell className="text-base" key={value.key}>
									{value.label}
								</Table.HeadCell>
							))}
						</Table.Head>
						<Table.Body className="divide-y">
							{products?.map((product) => (
								<Table.Row
									key={product._id}
									className="bg-red-200 text-base dark:border-gray-700 dark:bg-gray-800"
								>
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										{product.name}
									</Table.Cell>
									<Table.Cell>{product.sale_status}</Table.Cell>
									<Table.Cell>${product.price.buy}</Table.Cell>
									<Table.Cell>${product.price.minimun}</Table.Cell>
									<Table.Cell>${product.price.sale}</Table.Cell>
									<Table.Cell>{parseDate(product.createdOn)}</Table.Cell>
									<Table.Cell>
										<Button
											className="bg-inherit dark:bg-inherit"
											onClick={setOpenModal}
										>
											<MdOutlineEdit size={20} />
										</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</>
			) : (
				<>
					<span>No hay productos</span>
				</>
			)}
			<ProductPagination />

			<ModalComponent openModal={openModal} setOpenModal={setOpenModal} />
		</div>
	);
};

export default Dashboard;
