'use client';

import { useQuery } from '@tanstack/react-query';
import { getAttributes } from '@/services/attributes';
import { Spinner, Button, Badge } from 'flowbite-react';
import { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import AttributeList from './AttributeList';
import AttributeModal from './AttributeModal';

const AttributesTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Query para obtener atributos
  const {
    data: attributesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['attributes', currentPage, categoryFilter],
    queryFn: () =>
      getAttributes({
        page: currentPage,
        limit: 10,
        filters: categoryFilter !== 'all' ? { category: categoryFilter } : {},
      }),
    refetchOnMount: false,
  });

  const attributes = attributesData?.docs || [];
  const totalPages = attributesData?.totalPages || 1;

  const handleCreate = () => {
    setCurrentAttribute(null);
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleEdit = (attribute) => {
    setCurrentAttribute(attribute);
    setIsEdit(true);
    setOpenModal(true);
  };

  const categoryLabels = {
    all: 'Todos',
    processors: 'Procesadores',
    ram: 'Memoria RAM',
    storage: 'Almacenamiento',
    so: 'Sistemas Operativos',
    brands: 'Marcas',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error cargando atributos: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Configuración de Atributos
        </h2>
        <Button onClick={handleCreate} size="sm">
          <IoAddCircleOutline className="mr-2 h-5 w-5" />
          Crear Atributo
        </Button>
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            size="xs"
            color={categoryFilter === key ? 'blue' : 'gray'}
            onClick={() => {
              setCategoryFilter(key);
              setCurrentPage(1);
            }}
          >
            {label}
            {key !== 'all' && categoryFilter === key && (
              <Badge color="blue" className="ml-2">
                {attributes.length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Lista de atributos */}
      {attributes.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No hay atributos en esta categoría. Crea uno para comenzar.
        </div>
      ) : (
        <AttributeList
          attributes={attributes}
          onEdit={handleEdit}
        />
      )}

      {/* Paginación simple */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Modal de creación/edición */}
      <AttributeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        attribute={currentAttribute}
        isEdit={isEdit}
      />
    </div>
  );
};

export default AttributesTab;
