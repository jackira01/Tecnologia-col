import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';

import { ProductContext } from '@/context/productContext';
import { parseDataToModal, parseDate } from '@/utils';
import { useContext, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { headTitle } from '../defaultValues';
import Image from 'next/image';

const DashbProductList = ({ products }) => {
  const { setCurrentProduct, setIsEdit, setOpenModal } =
    useContext(ProductContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <div>
      <Table hoverable>
        <TableHead>
          <TableRow>
            {headTitle.map((value) => (
              <TableHeadCell
                className="text-base transition-colors duration-500"
                key={value.key}
              >
                {value.label}
              </TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="divide-y transition-colors duration-500">
          {products.map((product) => (
            <TableRow
              key={product._id}
              className="transition-colors duration-500 bg-mainLight-card text-base dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell className="transition-colors duration-500">
                {product.image_URL && product.image_URL.length > 0 ? (
                  <Image
                    width={100}
                    height={100}
                    src={product.image_URL[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(product.image_URL[0])}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Sin imagen</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="transition-colors duration-500 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {product.name}
              </TableCell>
              <TableCell>{product.active ? 'activo' : 'inactivo'}</TableCell>
              <TableCell>{product.disponibility}</TableCell>
              <TableCell>${product.price.buy}</TableCell>
              <TableCell>${product.price.minimun}</TableCell>
              <TableCell>${product.price.sale}</TableCell>
              <TableCell>${product.price.soldOn}</TableCell>
              <TableCell>{parseDate(product.createdOn)}</TableCell>
              <TableCell>
                <Button onClick={() => handleClickEdit(product)}>
                  <MdOutlineEdit className="text-mainDark-white" size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para mostrar imagen en detalle */}
      <Modal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="2xl"
      >
        <ModalHeader>Vista previa de imagen</ModalHeader>
        <ModalBody>
          <div className="flex justify-center">
            <img
              src={selectedImage}
              alt="Vista previa"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashbProductList;
