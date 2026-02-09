'use client';

import { ModalComponent } from '@/components/Dashboard/Forms/ModalComponent';
import { ProductPagination } from '@/components/Pagination/ProductPagination';
import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { useQuery } from '@tanstack/react-query';
import { Button, Spinner, Badge } from 'flowbite-react';
import { useContext, useEffect, useState, useMemo } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { HiExclamation } from 'react-icons/hi';
import DashbProductList from './ProductList';
import { DashboardFilterBar } from './DashboardFilterBar';
import { buildDashboardFilterQuery, getDefaultDashboardFilters } from '@/utils/filterUtils';

const ProductsTab = () => {
  const {
    currentPage,
    setTotalPages,
    setOpenModal,
  } = useContext(ProductContext);

  // Todos los hooks deben estar al inicio, antes de cualquier return condicional
  const [filterMode, setFilterMode] = useState('all');
  const [dashboardFilters, setDashboardFilters] = useState(getDefaultDashboardFilters());

  // Configuración de la query con cache inteligente
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tableProduct', currentPage, dashboardFilters],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: 8,
        filters: buildDashboardFilterQuery(dashboardFilters),
      }),
    refetchOnMount: false,
  });

  const products = productsData?.docs || [];

  // Filtrar productos según el modo seleccionado
  const filteredProducts = useMemo(() => {
    if (filterMode === 'needs_price_change') {
      return products.filter((p) =>
        ['quick_sale', 'recovery', 'critical'].includes(p.saleStatus?.status)
      );
    }
    return products;
  }, [products, filterMode]);

  // Contador de productos que necesitan cambio de precio
  const needsPriceChangeCount = useMemo(() => {
    return products.filter((p) =>
      ['quick_sale', 'recovery', 'critical'].includes(p.saleStatus?.status)
    ).length;
  }, [products]);

  // Manejo de paginación
  useEffect(() => {
    if (productsData) {
      setTotalPages(productsData.totalPages || 1);
    }
    return () => {
      setTotalPages(1);
    };
  }, [productsData, setTotalPages]);

  const handleFilterChange = (newFilters) => {
    setDashboardFilters(newFilters);
  };

  const handleClearFilters = () => {
    setDashboardFilters(getDefaultDashboardFilters());
  };

  // Ahora sí, los returns condicionales después de todos los hooks
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error cargando productos: {error?.message}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="overflow-x-auto">
        <div className="p-4 text-center text-gray-500">
          No hay productos disponibles
        </div>
        <ModalComponent />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Dashboard Filters */}
      <DashboardFilterBar
        filters={dashboardFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        products={products}
      />

      {/* Existing Filters */}
      <div className="flex gap-3 mb-4 items-center">
        <Button
          color={filterMode === 'all' ? 'blue' : 'gray'}
          onClick={() => setFilterMode('all')}
          size="sm"
        >
          Todos los Productos
        </Button>
        
        <Button
          color={filterMode === 'needs_price_change' ? 'warning' : 'gray'}
          onClick={() => setFilterMode('needs_price_change')}
          size="sm"
        >
          <HiExclamation className="mr-2 h-4 w-4" />
          Necesitan Cambio de Precio
          {needsPriceChangeCount > 0 && (
            <Badge color="warning" className="ml-2">
              {needsPriceChangeCount}
            </Badge>
          )}
        </Button>
      </div>

      <DashbProductList products={filteredProducts} />

      <ProductPagination />
      <ModalComponent />
    </div>
  );
};

export default ProductsTab;
