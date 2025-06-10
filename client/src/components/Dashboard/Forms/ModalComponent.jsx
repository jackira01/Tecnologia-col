'use client';

import { ProductContext } from '@/context/productContext';
import { defaultValuesForm } from '@/utils';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { useContext } from 'react';
import { FormComponent } from './FormComponent';

export const ModalComponent = () => {
  const { setCurrentProduct, openModal, setOpenModal } =
    useContext(ProductContext);
  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={() => {
        setCurrentProduct(defaultValuesForm);
        setOpenModal(false);
      }}
    >
      <ModalHeader />
      <ModalBody>
        <FormComponent />
      </ModalBody>
    </Modal>
  );
};
