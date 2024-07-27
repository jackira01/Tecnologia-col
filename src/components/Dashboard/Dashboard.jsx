"use client";

import { Button, Table } from "flowbite-react";
import { MdOutlineEdit } from "react-icons/md";
import { headTitle } from "./defaultValues";
import { useContext, useState } from "react";
import { ProductContext } from "@/context/productContext";
import { ModalForm } from "./Forms/ModalForm";

const Dashboard = () => {
	const { products } = useContext(ProductContext);
	const [openModal, setOpenModal] = useState(true);

	return (
		<div className="overflow-x-auto">
			{products.length ? (
				<Table hoverable>
					<Table.Head>
						{headTitle.map((value) => (
							<Table.HeadCell className="text-base" key={value.key}>
								{value.label}
							</Table.HeadCell>
						))}
					</Table.Head>
					<Table.Body className="divide-y">
						{products.map((product) => (
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
								<Table.Cell>{product.createdOn}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			) : (
				<>
					<span>No hay productos</span>
				</>
			)}

			<ModalForm openModal={openModal} setOpenModal={setOpenModal} />
		</div>
	);
};

export default Dashboard;
