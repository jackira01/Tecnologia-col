'use client';

import { ProductContext } from '@/context/productContext';
import { defaultValuesForm } from '@/utils';
import { Modal } from 'flowbite-react';
import { useContext } from 'react';
import { FormComponent } from './FormComponent';

export const ModalComponent = ({ openModal, setOpenModal }) => {
	const { setCurrentProduct } = useContext(ProductContext);
	return (
		<>
			<Modal
				show={openModal}
				size="md"
				popup
				onClose={() => {
					setCurrentProduct(defaultValuesForm);
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
