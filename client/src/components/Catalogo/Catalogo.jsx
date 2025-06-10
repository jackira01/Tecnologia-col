import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { Spinner } from 'flowbite-react';
import { useContext, useEffect } from 'react';
import { ProductPagination } from '../Pagination/ProductPagination';
import SideBarComponent from '../SideBar/SideBarComponent';
import { CardComponent } from './CardComponent';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const Catalogo = () => {
  const { setTotalPages, currentPage } = useContext(ProductContext);

  const dataPost = {
    page: currentPage,
    limit: 8,
    filters: {
      active: true,
    },
  };

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['catalogueProducts', currentPage],
    queryFn: () => getProducts(dataPost),
    onError: (error) => {
      toast.error('Ups, algo salió mal. Inténtalo más tarde.');
      console.error('Error fetching products:', error);
    },
  });

  useEffect(() => {
    if (productsData) {
      setTotalPages(productsData.totalPages || 1);
    }
    return () => {
      // Solo se ejecuta cuando el componente se desmonta completamente
      setTotalPages(1);
    };
  }, [setTotalPages, productsData]);

  if (error) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <p className="text-mainLight-text dark:text-mainDark-text">
          {error.message || 'Error al cargar los productos.'}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <SideBarComponent className="bg-[#31363F]" />

      <div className="flex flex-col justify-center items-center w-full min-h-screen">
        {
          <div className="w-full my-10 px-10">
            <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsData.docs?.map((data) => {
                return (
                  <div key={data._id} className="h-full flex justify-center">
                    <CardComponent data={data} />
                  </div>
                );
              })}
            </div>
            <ProductPagination />
          </div>
        }
      </div>
    </>
  );
};
