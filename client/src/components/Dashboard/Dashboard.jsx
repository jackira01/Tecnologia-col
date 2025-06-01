'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { parseDataToModal, parseDate } from '@/utils';
import { Button, Spinner, Table } from 'flowbite-react';
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
    error
  } = useQuery({
    queryKey: ['products', currentPage], // Se invalida solo cuando cambia la página
    queryFn: () => getProducts({
      page: currentPage,
      limit: 8,
      filters: {},
    }),
    staleTime: 5 * 60 * 1000, // Los datos son "fresh" por 5 minutos
    cacheTime: 10 * 60 * 1000, // Mantiene en cache por 10 minutos
    refetchOnWindowFocus: false, // No refetch al cambiar ventana
    refetchOnMount: false, // No refetch al montar si hay datos en cache
    enabled: !!session, // Solo ejecuta si hay sesión activa
    onSuccess: (data) => {
      // Actualiza el contexto solo cuando llegan nuevos datos
      if (data?.totalPages) {
        setTotalPages(data.totalPages);
      }
    }
  });

  // Manejo de autenticación
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Cleanup solo al desmontar completamente
  useEffect(() => {
    return () => {
      setTotalPages(1);
    };
  }, []);

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  // Loading state durante autenticación
  if (status === 'loading') {
    return <div className="flex justify-center p-4"><Spinner /></div>;
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

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <Button onClick={() => setOpenModal(true)}>
          <IoAddCircleOutline size={20} className="mx-2" />
          Crear Producto
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : products.length ? (
        <>
          <Table hoverable>
            <Table.Head>
              {headTitle.map((value) => (
                <Table.HeadCell
                  className="text-base transition-colors duration-500"
                  key={value.key}
                >
                  {value.label}
                </Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="divide-y transition-colors duration-500">
              {products.map((product) => (
                <Table.Row
                  key={product._id}
                  className="transition-colors duration-500 bg-mainLight-card text-base dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="transition-colors duration-500 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </Table.Cell>
                  <Table.Cell>{product.status}</Table.Cell>
                  <Table.Cell>{product.disponibility}</Table.Cell>
                  <Table.Cell>${product.price.buy}</Table.Cell>
                  <Table.Cell>${product.price.minimun}</Table.Cell>
                  <Table.Cell>${product.price.sale}</Table.Cell>
                  <Table.Cell>${product.price.soldOn}</Table.Cell>
                  <Table.Cell>{parseDate(product.createdOn)}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => handleClickEdit(product)}>
                      <MdOutlineEdit className="text-mainDark-white" size={20} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No hay productos disponibles
        </div>
      )}

      <ProductPagination />
      <ModalComponent openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
};

export default Dashboard;