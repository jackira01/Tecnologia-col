import { useQuery } from '@tanstack/react-query';
import { getAttributesByCategory } from '@/services/attributes';
import { Spinner, Button, Badge } from 'flowbite-react';
import { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import AttributeList from './AttributeList';
import AttributeModal from './AttributeModal';

const AttributesTab = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('processors'); // Default to first category
  const [selectedList, setSelectedList] = useState(''); // For modal context (e.g. adding to 'brands')
  const [editingItem, setEditingItem] = useState(null); // { key: 'brands', value: 'Intel' } or { key: 'families', value: { value: 'Core i5', parent: 'Intel' } }

  const [initialParent, setInitialParent] = useState(''); // New state for pre-filling parent

  // Query para obtener el objeto de la categoría seleccionada
  const {
    data: attributeDoc,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['attributes', categoryFilter],
    queryFn: () => getAttributesByCategory(categoryFilter),
    refetchOnMount: false,
  });

  const handleCreate = (listKey = '', parentValue = '') => {
    setSelectedList(listKey);
    setInitialParent(parentValue); // Set the parent
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleEdit = (listKey, item) => {
    // If item is string, normalize to object structure temporarily for modal
    const valueObj = typeof item === 'string' ? { value: item } : item;
    setSelectedList(listKey);
    setInitialParent(''); // Reset initial parent on edit
    setEditingItem({ key: listKey, ...valueObj });
    setOpenModal(true);
  };

  const categoryLabels = {
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
      {/* Header con botón crear general (opcional, o por lista) */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Configuración de Atributos
        </h2>
        {/* Helper text or global add button if needed */}
      </div>

      {/* Tabs por categoría */}
      <div className="flex gap-2 flex-wrap border-b pb-2 dark:border-gray-700">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            color={categoryFilter === key ? 'blue' : 'gray'}
            onClick={() => setCategoryFilter(key)}
            className="rounded-full"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Contenido de la categoría */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
         <AttributeList
           attributeDoc={attributeDoc}
           category={categoryFilter}
           onAdd={handleCreate}
           onEdit={handleEdit}
         />
      </div>

      {/* Modal de creación/edición */}
      <AttributeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={categoryFilter}
        defaultList={selectedList}
        existingData={attributeDoc?.data || {}}
        editingItem={editingItem}
        initialParent={initialParent}
      />
    </div>
  );
};

export default AttributesTab;
