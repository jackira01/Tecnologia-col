import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { Spinner } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';
import { ProductPagination } from '../Pagination/ProductPagination';
import SideBarComponent from '../SideBar/SideBarComponent';
import { CardComponent } from './CardComponent';

export const Catalogo = () => {
  const { setTotalPages, error, setError, currentPage, products, setProducts, setCurrentPage } =
    useContext(ProductContext);

  const [ loaderProducts, setLoaderProducts ] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoaderProducts(true);

      const data = {
        page: currentPage,
        limit: 8,
        filters: {
          active: true,
        },
      };

      const response = await getProducts(data);

      if (response?.docs.length) {
        setTotalPages(response.totalPages);
        setProducts(response.docs);
        setLoaderProducts(false);
      } else {
        setError('No se encontraron productos');
        setProducts([]);
        setLoaderProducts(false);
      }
    };
    fetchProducts();
  }, [setLoaderProducts, setProducts, setTotalPages, setError, currentPage]);

  useEffect(() => {
  return () => {
    // Solo se ejecuta cuando el componente se desmonta completamente
    setTotalPages(1);
    setProducts([]);
    setCurrentPage(1);
  };
}, []); // Array vacío = solo al desmontar

  return (
    <>
      <SideBarComponent className="bg-[#31363F]" />

      <div className="flex flex-col justify-center items-center w-full min-h-screen">
        {loaderProducts ? (
          <Spinner />
        ) : error ? (
          <p className="text-mainLight-text dark:text-mainDark-text">{error}</p>
        ) : (
          <div className="w-full my-10 px-10">
            <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products?.map((data) => {
                return (
                  <div key={data._id} className="h-full flex justify-center">
                    <CardComponent data={data} />
                  </div>
                );
              })}
            </div>
            <ProductPagination />
          </div>
        )}
      </div>
    </>
  );
};
