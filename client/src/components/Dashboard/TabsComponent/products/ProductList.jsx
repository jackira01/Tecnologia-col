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
  Tooltip,
} from 'flowbite-react';

import { ProductContext } from '@/context/productContext';
import { parseDataToModal, parseDate } from '@/utils';
import { useContext, useState } from 'react';
import { MdOutlineEdit, MdRemoveRedEye } from 'react-icons/md';
import { headTitle } from '../defaultValues';
import Image from 'next/image';
import { SaleStatusBadge } from '@/components/Dashboard/SaleStatusBadge';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


const DashbProductList = ({ products }) => {
  const { setCurrentProduct, setIsEdit, setOpenModal } =
    useContext(ProductContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleView = (productId) => {
    // Solo admins pueden ver productos inactivos/vendidos
    if (session?.user?.role === 'admin') {
      router.push(`/${productId}`);
    } else {
      router.push('/');
    }
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
                className="text-sm transition-colors duration-500"
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
              <TableCell className="transition-colors duration-500 max-w-xs">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-900 dark:text-white" title={product.name}>
                  {product.name}
                </div>
              </TableCell>
              <TableCell>{product.active ? 'activo' : 'inactivo'}</TableCell>
              <TableCell>{product.disponibility}</TableCell>
              <TableCell>
                {product.saleStatus && product.disponibility !== 'vendido' && (
                  <Tooltip 
                    content={
                      <div className="max-w-sm">
                        <p className="font-semibold">{product.saleStatus.label}</p>
                        <p className="text-xs mt-1">{product.saleStatus.description}</p>
                        {product.saleStatus.suggestedPrice && (
                          <p className="text-xs mt-1 text-yellow-300">
                            Precio sugerido: ${product.saleStatus.suggestedPrice.toLocaleString('es-CO')}
                          </p>
                        )}
                      </div>
                    }
                  >
                    <div className="cursor-help">
                      <SaleStatusBadge saleStatus={product.saleStatus} />
                    </div>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>${product.price.buy}</TableCell>
              <TableCell>${product.price.minimun}</TableCell>
              <TableCell>${product.price.sale}</TableCell>
              <TableCell>${product.price.soldOn}</TableCell>
              <TableCell>{parseDate(product.timeline?.publishedAt || product.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="xs" onClick={() => handleView(product._id)}>
                    <MdRemoveRedEye className="text-mainDark-white" size={18} />
                  </Button>
                  <Button size="xs" onClick={() => handleClickEdit(product)}>
                    <MdOutlineEdit className="text-mainDark-white" size={18} />
                  </Button>
                </div>
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
