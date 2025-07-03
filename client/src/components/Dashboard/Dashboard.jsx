'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { useQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { ProductPagination } from '../Pagination/ProductPagination';
import { ModalComponent } from './Forms/ModalComponent';
import TableComponent from './TableComponent/TableComponent';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    currentPage, // Asume que tienes currentPage en el contexto
    setTotalPages,
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
  });

  // Manejo de autenticación
  useEffect(() => {
    /* if (status !== 'loading' && !session) {
      router.push('/');
    } */
    if (productsData) {
      setTotalPages(productsData.totalPages || 1); // Asegura que totalPages sea al menos 1
    }
    // Cleanup solo al desmontar completamente
    return () => {
      setTotalPages(1);
    };
  }, [
    /* session,  */ /* router, */ productsData,
    setTotalPages /* , status */,
  ]);

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

  if (!products.length) {
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

      <TableComponent products={products} />

      <ProductPagination />
      <ModalComponent />
    </div>
  );
};

export default Dashboard;
