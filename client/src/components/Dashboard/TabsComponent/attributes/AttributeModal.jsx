'use client';

import { Modal, ModalHeader, ModalBody, Button, Label, Select, TextInput, Spinner } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAttribute, updateAttribute } from '@/services/attributes';
import toast from 'react-hot-toast';

const AttributeModal = ({ open, onClose, attribute, isEdit }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    category: 'processors',
    value: '',
    active: true,
    metadata: {
      brand: '',
      family: '',
      generation: '',
      size: '',
      type: '',
      capacity: '',
      storageType: '',
    },
  });

  // Cargar datos del atributo al editar
  useEffect(() => {
    if (attribute && isEdit) {
      setFormData({
        category: attribute.category || 'processors',
        value: attribute.value || '',
        active: attribute.active !== undefined ? attribute.active : true,
        metadata: {
          brand: attribute.metadata?.brand || '',
          family: attribute.metadata?.family || '',
          generation: attribute.metadata?.generation || '',
          size: attribute.metadata?.size || '',
          type: attribute.metadata?.type || '',
          capacity: attribute.metadata?.capacity || '',
          storageType: attribute.metadata?.storageType || '',
        },
      });
    } else {
      // Reset al crear nuevo
      setFormData({
        category: 'processors',
        value: '',
        active: true,
        metadata: {
          brand: '',
          family: '',
          generation: '',
          size: '',
          type: '',
          capacity: '',
          storageType: '',
        },
      });
    }
  }, [attribute, isEdit, open]);

  const { mutate: createMutation, isLoading: isCreating } = useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries(['attributes']);
      toast.success('Atributo creado exitosamente');
      onClose();
    },
  });

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation({
    mutationFn: updateAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries(['attributes']);
      toast.success('Atributo actualizado exitosamente');
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar metadata vacía
    const cleanMetadata = {};
    Object.entries(formData.metadata).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        cleanMetadata[key] = value.trim();
      }
    });

    const payload = {
      category: formData.category,
      value: formData.value.trim(),
      active: formData.active,
      metadata: cleanMetadata,
    };

    if (isEdit && attribute) {
      updateMutation({ ...payload, _id: attribute._id });
    } else {
      createMutation(payload);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetadataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const renderMetadataFields = () => {
    switch (formData.category) {
      case 'processors':
        return (
          <>
            <div>
              <Label htmlFor="brand" value="Marca (Intel, AMD, etc.)" />
              <TextInput
                id="brand"
                value={formData.metadata.brand}
                onChange={(e) => handleMetadataChange('brand', e.target.value)}
                placeholder="Intel"
              />
            </div>
            <div>
              <Label htmlFor="family" value="Familia (Core i5, Ryzen 5, etc.)" />
              <TextInput
                id="family"
                value={formData.metadata.family}
                onChange={(e) => handleMetadataChange('family', e.target.value)}
                placeholder="Core i5"
              />
            </div>
            <div>
              <Label htmlFor="generation" value="Generación (10th Gen, 11th Gen, etc.)" />
              <TextInput
                id="generation"
                value={formData.metadata.generation}
                onChange={(e) => handleMetadataChange('generation', e.target.value)}
                placeholder="11th Gen"
              />
            </div>
          </>
        );
      
      case 'ram':
        return (
          <>
            <div>
              <Label htmlFor="size" value="Tamaño (4GB, 8GB, etc.)" />
              <TextInput
                id="size"
                value={formData.metadata.size}
                onChange={(e) => handleMetadataChange('size', e.target.value)}
                placeholder="8GB"
              />
            </div>
            <div>
              <Label htmlFor="type" value="Tipo (DDR3, DDR4, etc.)" />
              <TextInput
                id="type"
                value={formData.metadata.type}
                onChange={(e) => handleMetadataChange('type', e.target.value)}
                placeholder="DDR4"
              />
            </div>
          </>
        );
      
      case 'storage':
        return (
          <>
            <div>
              <Label htmlFor="capacity" value="Capacidad (256GB, 512GB, etc.)" />
              <TextInput
                id="capacity"
                value={formData.metadata.capacity}
                onChange={(e) => handleMetadataChange('capacity', e.target.value)}
                placeholder="512GB"
              />
            </div>
            <div>
              <Label htmlFor="storageType" value="Tipo (SSD, HDD, etc.)" />
              <TextInput
                id="storageType"
                value={formData.metadata.storageType}
                onChange={(e) => handleMetadataChange('storageType', e.target.value)}
                placeholder="SSD"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal show={open} onClose={onClose} size="lg">
      <ModalHeader>
        {isEdit ? 'Editar Atributo' : 'Crear Nuevo Atributo'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Categoría */}
          <div>
            <Label htmlFor="category" value="Categoría *" />
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
            >
              <option value="processors">Procesadores</option>
              <option value="ram">Memoria RAM</option>
              <option value="storage">Almacenamiento</option>
              <option value="so">Sistemas Operativos</option>
              <option value="brands">Marcas</option>
            </Select>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="value" value="Valor *" />
            <TextInput
              id="value"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="Ej: Intel Core i5 11th Gen"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Este es el valor principal que se mostrará en los selectores
            </p>
          </div>

          {/* Metadata según categoría */}
          {renderMetadataFields() && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Información Adicional (Opcional)
              </h3>
              <div className="space-y-3">
                {renderMetadataFields()}
              </div>
            </div>
          )}

          {/* Estado */}
          <div>
            <Label htmlFor="active" value="Estado" />
            <Select
              id="active"
              value={formData.active.toString()}
              onChange={(e) => handleChange('active', e.target.value === 'true')}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4">
            <Button color="gray" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>{isEdit ? 'Actualizar' : 'Crear'}</>
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AttributeModal;
