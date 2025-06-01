'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { Pagination, Spinner } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';

export const ProductPagination = () => {
  const {
    setProducts,
    totalPages,
    currentPage,
    setCurrentPage
  } = useContext(ProductContext);

  const data = {
    page: currentPage,
    limit: 8,
    filters: {},
  };

  const onPageChange = async (page) => {
    const response = await getProducts({data, page});
    setProducts(response.docs);
    setCurrentPage(response.page);
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
