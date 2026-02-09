'use client';

import { ProductContext } from '@/context/productContext';
import { defaultValuesForm } from '@/utils';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { useContext } from 'react';
import { FormComponent } from './FormComponent';

export const ModalComponent = () => {
  const { setCurrentProduct, openModal, setOpenModal, isEdit } =
    useContext(ProductContext);
  return (
    <Modal
      show={openModal}
      size="5xl"
      popup
      onClose={() => {
        setCurrentProduct(defaultValuesForm);
        setOpenModal(false);
      }}
    >
      <ModalHeader className="p-4">
        {isEdit ? 'Editar Producto' : 'Creación de Producto'}
      </ModalHeader>
      <ModalBody>
        <FormComponent />
      </ModalBody>
    </Modal>
  );
};
