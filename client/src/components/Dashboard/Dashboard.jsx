'use client';

import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { parseDataToModal, parseDate } from '@/utils';
import { Button, Spinner, Table } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineEdit } from 'react-icons/md';
import { ProductPagination } from '../Pagination/ProductPagination';
import { ModalComponent } from './Forms/ModalComponent';
import { headTitle } from './defaultValues';

const Dashboard = () => {
  const {
    products,
    loaderProducts,
    setLoaderProducts,
    setProducts,
    setTotalPages,
    setCurrentProduct,
    setIsEdit,
    openModal,
    setOpenModal,
  } = useContext(ProductContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoaderProducts(true);
      const response = await getProducts();
      setTotalPages(response.totalPages);
      setProducts(response.docs);
      setLoaderProducts(false);
    };
    fetchProducts();

    return () => {
      setTotalPages(1);
      setProducts([]);
    };
  }, [setLoaderProducts, setProducts, setTotalPages]);

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <Button onClick={setOpenModal}>
          <IoAddCircleOutline size={20} className="mx-2" />
          Crear Producto
        </Button>
      </div>
      {loaderProducts ? (
        <Spinner />
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
              {products?.map((product) => (
                <Table.Row
                  key={product._id}
                  className="transition-colors duration-500 bg-mainLight-card text-base dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="transition-colors duration-500 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </Table.Cell>
                  <Table.Cell>{product.sale_status}</Table.Cell>
                  <Table.Cell>${product.price.buy}</Table.Cell>
                  <Table.Cell>${product.price.minimun}</Table.Cell>
                  <Table.Cell>${product.price.sale}</Table.Cell>
                  <Table.Cell>{parseDate(product.createdOn)}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={(e) => handleClickEdit(product)}>
                      <MdOutlineEdit
                        className="text-mainDark-white"
                        size={20}
                      />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <>
          <span>No hay productos</span>
        </>
      )}
      <ProductPagination />

      <ModalComponent openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
};

export default Dashboard;
