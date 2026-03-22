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
import { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineEdit, MdRemoveRedEye, MdViewColumn } from 'react-icons/md';
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
  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initial = {};
    for (const col of headTitle) {
      initial[col.key] = col.defaultVisible ?? true;
    }
    return initial;
  });

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) {
        setShowColMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* Column visibility toggle */}
      <div className="flex justify-end mb-2">
        <div className="relative" ref={colMenuRef}>
          <Button size="xs" color="light" onClick={() => setShowColMenu((v) => !v)}>
            <MdViewColumn size={18} className="mr-1" />
            Columnas
          </Button>
          {showColMenu && (
            <div className="absolute right-0 z-10 mt-1 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
              {headTitle.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-blue-600"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <Table hoverable>
        <TableHead>
          <TableRow>
            {headTitle.map((col) =>
              visibleColumns[col.key] ? (
                <TableHeadCell
                  className="text-sm transition-colors duration-500"
                  key={col.key}
                >
                  {col.label}
                </TableHeadCell>
              ) : null,
            )}
          </TableRow>
        </TableHead>
        <TableBody className="divide-y transition-colors duration-500">
          {products.map((product) => (
            <TableRow
              key={product._id}
              className="transition-colors duration-500 bg-mainLight-card text-base dark:border-gray-700 dark:bg-gray-800"
            >
              {/* key 1: IMAGEN */}
              {visibleColumns[1] && (
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
              )}
              {/* key 2: NOMBRE */}
              {visibleColumns[2] && (
                <TableCell className="transition-colors duration-500 max-w-xs">
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-900 dark:text-white" title={product.name}>
                    {product.name}
                  </div>
                  {product.acquisitionType === 'co_investment' && product.price?.myInvestment > 0 && (
                    <div className="mt-1">
                      {(() => {
                        const total = (product.price.buy || 0) + (product.price.otherExpenses || 0);
                        const pct = total > 0 ? Math.round((product.price.myInvestment / total) * 100) : 0;
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            Co-inv: {pct}%
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </TableCell>
              )}
              {/* key 3: ESTADO */}
              {visibleColumns[3] && (
                <TableCell>{product.active ? 'activo' : 'inactivo'}</TableCell>
              )}
              {/* key 4: DISPONIBILIDAD */}
              {visibleColumns[4] && (
                <TableCell>{product.disponibility || 'N/A'}</TableCell>
              )}
              {/* key 5: ESTADO DE VENTA */}
              {visibleColumns[5] && (
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
              )}
              {/* key 6: COMPRADO EN */}
              {visibleColumns[6] && (
                <TableCell>${product.price?.buy || 0}</TableCell>
              )}
              {/* key 7: PRECIO MINIMO */}
              {visibleColumns[7] && (
                <TableCell>${product.price?.minimun || 0}</TableCell>
              )}
              {/* key 8: PRECIO CLIENTE */}
              {visibleColumns[8] && (
                <TableCell>${product.price?.sale || 0}</TableCell>
              )}
              {/* key 9: VENDIDO EN */}
              {visibleColumns[9] && (
                <TableCell>${product.price?.soldOn || 0}</TableCell>
              )}
              {/* key 10: Tiempo Activo */}
              {visibleColumns[10] && (
                <TableCell>{parseDate(product.timeline?.publishedAt || product.createdAt)}</TableCell>
              )}
              {/* key 11: Opciones */}
              {visibleColumns[11] && (
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
              )}
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
