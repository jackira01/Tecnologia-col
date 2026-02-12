
import { Button, Card, Badge } from 'flowbite-react';
import { MdDelete, MdAdd, MdEdit } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeValueFromCategory } from '@/services/attributes';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AttributeList = ({ attributeDoc, category, onAdd, onEdit }) => {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState({}); // { brands: 'Intel', families: 'Core i5' }

  // Configuration for which lists to show per category
  const categoryConfig = {
    processors: [
      { key: 'brands', label: 'Marcas' },
      { key: 'families', label: 'Familias', parentKey: 'brands' },
      { key: 'generations', label: 'Generaciones', parentKey: 'families' },
    ],
    ram: [
      { key: 'types', label: 'Tipos' },
      { key: 'sizes', label: 'Capacidades' },
    ],
    storage: [
      { key: 'types', label: 'Tipos' },
      { key: 'capacities', label: 'Capacidades' },
    ],
    so: [
      { key: 'versions', label: 'Versiones' },
    ],
    brands: [
      { key: 'names', label: 'Nombres' },
    ],
  };

  const config = categoryConfig[category] || [];
  const data = attributeDoc?.data || {};

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (payload) => removeValueFromCategory({ category, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes', category] });
      // toast.success('Valor eliminado'); // Handled by service
    },
    onError: () => {
      // toast.error('Error al eliminar valor'); // Handled by service
    },
  });

  const handleDelete = (key, rawItem) => {
    const value = typeof rawItem === 'string' ? rawItem : rawItem.value;
    const parent = typeof rawItem === 'string' ? undefined : rawItem.parent;
    
    if (confirm(`¿Estás seguro de eliminar "${value}" de la lista?`)) {
      deleteMutation({ key, value, parent });
    }
  };
  
  const handleSelect = (key, value) => {
      setSelectedItems(prev => ({
          ...prev,
          [key]: value
      }));
  };

  // Combine config with any extra keys found in data
  const dataKeys = Object.keys(data);
  const configKeys = config.map(c => c.key);
  const allKeys = Array.from(new Set([...configKeys, ...dataKeys]));

  if (allKeys.length === 0 && config.length === 0) {
    return <div className="text-gray-500">Categoría sin atributos.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allKeys.map((key) => {
        const knownConfig = config.find(c => c.key === key);
        const label = knownConfig?.label || key.charAt(0).toUpperCase() + key.slice(1);
        const parentKey = knownConfig?.parentKey;
        
        let items = data[key] || [];
        
        // Filter if parent selected
        if (parentKey) {
            const selectedParent = selectedItems[parentKey];
            if (selectedParent) {
                items = items.filter(item => {
                    if (typeof item === 'string') return true; // Legacy strings shown? or hidden? Let's show all or none. 
                    // Ideally show only matching. Strings have no parent, so strictly speaking they don't match.
                    // But to be friendly during migration, maybe show them under "Unassigned"?
                    // For now, strict filter:
                    return item.parent === selectedParent;
                });
            } else {
                 // If no parent selected, maybe show empty or all?
                 // "Select a Brand to see Families"
                 items = []; 
            }
        }
        
        // Sort items (objects vs strings)
        items.sort((a, b) => {
            const valA = typeof a === 'string' ? a : a.value;
            const valB = typeof b === 'string' ? b : b.value;
            return valA.localeCompare(valB, undefined, { numeric: true });
        });

        // Current Level Selection
        const currentSelection = selectedItems[key];

        return (
          <Card key={key} className="h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {label}
                  </h3>
                   {parentKey && !selectedItems[parentKey] && (
                      <span className="text-xs text-orange-500">Selecciona {knownConfig.parentKey} primero</span>
                   )}
              </div>
               <Button size="xs" color="blue" onClick={() => {
                const parentValueForAdd = parentKey ? selectedItems[parentKey] : undefined;
                onAdd(key, parentValueForAdd);
               }}>
                <MdAdd className="mr-1 h-4 w-4" /> Agregar
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {items.length === 0 ? (
                 <p className="text-sm text-gray-500 italic p-2">
                    {parentKey && !selectedItems[parentKey] ? 'Esperando selección...' : 'No hay elementos.'}
                 </p>
              ) : (
                <ul className="space-y-1">
                  {items.map((rawItem, index) => {
                    const itemValue = typeof rawItem === 'string' ? rawItem : rawItem.value;
                    const isSelected = currentSelection === itemValue;
                    
                    return (
                    <li 
                      key={`${key}-${index}`} 
                      className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${
                          isSelected 
                          ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300' 
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleSelect(key, itemValue)}
                    >
                      <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {itemValue}
                          </span>
                      </div>
                      
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(key, rawItem)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Editar"
                        >
                            <MdEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(key, rawItem)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Eliminar"
                        >
                          <MdDelete className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  )})}
                </ul>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AttributeList;
