import { Modal, ModalHeader, ModalBody, Button, Label, TextInput, Spinner, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addValueToCategory, updateValueInCategory } from '@/services/attributes';

const AttributeModal = ({ open, onClose, category, defaultList, existingData, editingItem, initialParent }) => {
  const queryClient = useQueryClient();
  const [listKey, setListKey] = useState(defaultList || '');
  const [customListKey, setCustomListKey] = useState('');
  const [value, setValue] = useState('');
  const [selectedParent, setSelectedParent] = useState('');

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setListKey(editingItem.key);
        setValue(editingItem.value || '');
        setSelectedParent(editingItem.parent || '');
        setCustomListKey('');
      } else {
        setListKey(defaultList || '');
        setCustomListKey('');
        setValue('');
        setSelectedParent(initialParent || ''); // Use initialParent if provided
      }
    }
  }, [open, defaultList, editingItem, initialParent]);

  // Configuration (Duplicated from List for now, could be shared constant)
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
  const currentConfig = config.find(c => c.key === listKey);
  const listLabel = currentConfig?.label || (listKey === 'custom_new' ? 'Nueva Lista' : listKey);

  // Get hierarchy config
  const parentKey = currentConfig?.parentKey;
  const parentList = parentKey && existingData[parentKey] ? existingData[parentKey] : [];
  


  const { mutate: addMutation, isLoading: isAdding } = useMutation({
    mutationFn: addValueToCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['attributes', category]);
      onClose();
    },
  });

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation({
    mutationFn: updateValueInCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['attributes', category]);
      onClose();
    },
  });

  const isLoading = isAdding || isUpdating;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalKey = listKey === 'custom_new' ? customListKey.trim() : listKey;

    if (!value.trim() || !finalKey) return;
    
    // Construct payload
    let payload = {
      category,
      key: finalKey,
    };

    const finalValue = (parentKey && selectedParent) ? { value: value.trim(), parent: selectedParent } : value.trim();

    if (editingItem) {
        // Prepare Update Payload
        payload = {
            ...payload,
            oldValue: editingItem.value, // This is current value before edit
            newValue: value.trim(),
            newParent: (parentKey && selectedParent) ? selectedParent : undefined
        };
        updateMutation(payload);
    } else {
        // Prepare Add Payload
        payload.value = finalValue;
        addMutation(payload);
    }
  };

  return (
    <Modal show={open} onClose={onClose} size="md">
      <ModalHeader>
        {editingItem ? 'Editar' : 'Agregar a'} {category === 'brands' ? 'Marcas' : listLabel}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Selector de lista (si no se pasó por defecto o se quiere cambiar) */}
          {!defaultList && (
            <div>
              <Label htmlFor="listSelect" value="Seleccionar Lista" />
              <Select
                id="listSelect"
                value={listKey === 'custom_new' ? 'custom_new' : listKey}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom_new') {
                    setListKey('custom_new');
                  } else {
                    setListKey(val);
                  }
                }}
                required
              >
                <option value="">Seleccione...</option>
                {config.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
                 <option value="custom_new">+ Nueva Lista (Personalizada)</option>
              </Select>
            </div>
          )}

          {listKey === 'custom_new' && (
            <div>
              <Label htmlFor="customKey" value="Nombre de la Nueva Lista (Clave)" />
              <TextInput
                id="customKey"
                placeholder="Ej: socket, cache_size"
                onChange={(e) => setCustomListKey(e.target.value)}
                value={customListKey}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Esto creará una nueva lista de variantes en esta categoría.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="value" value={`Nuevo Valor para ${listKey === 'custom_new' ? (customListKey || 'Nueva Lista') : listLabel}`} />
            <TextInput
              id="value"
              placeholder={`Ej: ${category === 'processors' && listKey === 'brands' ? 'Intel' : 'Valor...'}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Selector de Padre (si aplica jerarquía) */}
          {parentKey && parentList.length > 0 && (
            <div>
              <Label htmlFor="parentSelect" value={`Seleccionar ${parentKey === 'brands' ? 'Marca' : 'Padre'}`} />
              <Select
                id="parentSelect"
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {parentList.map((p, idx) => {
                  // Handle if parent is object or string
                  const val = typeof p === 'string' ? p : p.value;
                  return <option key={idx} value={val}>{val}</option>;
                })}
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !listKey || !value.trim()}>
              {isLoading ? <Spinner size="sm" /> : (editingItem ? 'Actualizar' : 'Agregar')}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AttributeModal;
