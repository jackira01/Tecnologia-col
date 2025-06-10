'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { parseDataToModal, parseDate } from '@/utils';
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineEdit } from 'react-icons/md';
import { ProductPagination } from '../Pagination/ProductPagination';
import { ModalComponent } from './Forms/ModalComponent';
import { headTitle } from './defaultValues';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    currentPage, // Asume que tienes currentPage en el contexto
    setTotalPages,
    setCurrentProduct,
    setIsEdit,
    openModal,
    setOpenModal,
  } = useContext(ProductContext);

  // Configuración de la query con cache inteligente
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tableProduct', currentPage], // Se invalida solo cuando cambia la página
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: 8,
        filters: {},
      }),
    refetchOnMount: false, // No refetch al montar si hay datos en cache
    enabled: !!session, // Solo ejecuta si hay sesión activa
  });

  // Manejo de autenticación
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
    if (productsData) {
      setTotalPages(productsData.totalPages || 1); // Asegura que totalPages sea al menos 1
    }
    // Cleanup solo al desmontar completamente
    return () => {
      setTotalPages(1);
    };
  }, [session, router, productsData, setTotalPages]);

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  // Loading state durante autenticación
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error cargando productos: {error?.message}
      </div>
    );
  }

  const products = productsData?.docs || [];

  if (!productsData.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay productos disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <Button onClick={() => setOpenModal(true)}>
          <IoAddCircleOutline size={20} className="mx-2" />
          Crear Producto
        </Button>
      </div>

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
              <TableCell className="transition-colors duration-500 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {product.name}
              </TableCell>
              <TableCell>{product.status}</TableCell>
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

      <ProductPagination />
      <ModalComponent openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
};

export default Dashboard;
