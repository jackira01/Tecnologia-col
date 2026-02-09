import { ProductContext } from '@/context/productContext';
import { getProducts } from '@/services/products';
import { Spinner, Button } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';
import { ProductPagination } from '../Pagination/ProductPagination';
import SideBarComponent from '../SideBar/SideBarComponent';
import { CardComponent } from './CardComponent';
import { FilterPanel } from './FilterPanel';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { buildFilterQuery, getDefaultFilters } from '@/utils/filterUtils';
import { HiFilter } from 'react-icons/hi';

export const Catalogo = () => {
  const { setTotalPages, currentPage } = useContext(ProductContext);
  const [filters, setFilters] = useState(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);

  const dataPost = {
    page: currentPage,
    limit: 8,
    filters: {
      active: true,
      ...buildFilterQuery(filters),
    },
  };

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['catalogueProducts', currentPage, filters],
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false); // Close filter panel on mobile after applying
  };

  const handleClearFilters = () => {
    setFilters(getDefaultFilters());
  };

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

      <div className="flex w-full min-h-screen">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full shadow-lg"
            size="lg"
          >
            <HiFilter className="mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filter Panel - Desktop Sidebar / Mobile Drawer */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:block
          `}
        >
          <div className="h-full overflow-y-auto pt-20 lg:pt-4 px-2">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Overlay for mobile */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Products Grid */}
        <div className="flex flex-col justify-center items-center w-full">
          {productsData?.docs && productsData.docs.length > 0 ? (
            <div className="w-full my-10 px-10">
              <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsData.docs.map((data) => {
                  return (
                    <div key={data._id} className="h-full flex justify-center">
                      <CardComponent data={data} />
                    </div>
                  );
                })}
              </div>
              <ProductPagination />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                No se encontraron productos con los filtros seleccionados
              </p>
              <Button onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

