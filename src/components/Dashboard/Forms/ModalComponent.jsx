"use client";

import { Modal } from "flowbite-react";
import { FormComponent } from "./FormComponent";
import { defaultValuesForm } from "@/utils";
import { useContext } from "react";
import { ProductContext } from "@/context/productContext";

export const ModalComponent = ({ openModal, setOpenModal }) => {
	const { setInitialFormValues } = useContext(ProductContext);
	return (
		<>
			<Modal
				show={openModal}
				size="md"
				popup
				onClose={() => {
					setInitialFormValues(defaultValuesForm);
					setOpenModal(false);
				}}
			>
				<Modal.Header />
				<Modal.Body>
					<FormComponent />
				</Modal.Body>
			</Modal>
		</>
	);
};
