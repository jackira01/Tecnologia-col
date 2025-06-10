'use client';

import { ProductContext } from '@/context/productContext';
import { Pagination } from 'flowbite-react';
import { useContext } from 'react';

export const ProductPagination = () => {
  const { setProducts, totalPages, currentPage, setCurrentPage } =
    useContext(ProductContext);

  const onPageChange = async (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="col-span-3 mt-10 flex w-full items-center justify-center">
      {
        <div className="flex flex-col justify-end">
          <p className="text-mainLight-text dark:text-mainDark-white ml-10">
            pagina <strong>{currentPage}</strong> de{' '}
            <strong>{totalPages}</strong>{' '}
          </p>
          <Pagination
            previousLabel="Anterior"
            nextLabel="Siguiente"
            layout="navigation"
            showIcons
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      }
    </div>
  );
};
