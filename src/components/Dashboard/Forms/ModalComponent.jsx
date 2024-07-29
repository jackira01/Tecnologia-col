"use client";

import { Modal } from "flowbite-react";
import { FormComponent } from "./FormComponent";

export const ModalComponent = ({ openModal, setOpenModal }) => {
	return (
		<>
			<Modal
				show={openModal}
				size="md"
				popup
				onClose={() => setOpenModal(false)}
			>
				<Modal.Header />
				<Modal.Body>
					<FormComponent/>
				</Modal.Body>
			</Modal>
		</>
	);
};
