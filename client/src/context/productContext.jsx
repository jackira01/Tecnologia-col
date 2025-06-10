'use client';

import { defaultValuesForm } from '@/utils';
import { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [currentProduct, setCurrentProduct] = useState(defaultValuesForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [loaderProducts, setLoaderProducts] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(undefined);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loaderProducts,
        setLoaderProducts,
        openModal,
        setOpenModal,
        totalPages,
        setTotalPages,
        currentProduct,
        setCurrentProduct,
        isEdit,
        setIsEdit,
        error,
        setError,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
