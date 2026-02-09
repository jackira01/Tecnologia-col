'use client';

import { Modal, ModalHeader, ModalBody, Button, Label, Select, TextInput, Textarea, Spinner } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead, updateLead } from '@/services/leads';
import CurrencyInput from 'react-currency-input-field';

const BRAND_OPTIONS = [
  'HP',
  'Dell',
  'Lenovo',
  'Asus',
  'Acer',
  'Apple',
  'MSI',
  'Toshiba',
  'Samsung',
  'Otro',
];

const RAM_OPTIONS = [
  { value: null, label: 'Sin preferencia' },
  { value: 4, label: '4GB o más' },
  { value: 8, label: '8GB o más' },
  { value: 16, label: '16GB o más' },
  { value: 32, label: '32GB o más' },
];

const PROCESSOR_BRANDS = [
  { value: null, label: 'Sin preferencia' },
  { value: 'Intel', label: 'Intel' },
  { value: 'AMD', label: 'AMD' },
];

const INTEL_FAMILIES = ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Celeron', 'Pentium'];
const AMD_FAMILIES = ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'Athlon'];

const LeadForm = ({ open, onClose, lead, isEdit }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    clientName: '',
    whatsapp: '',
    budget: '',
    requirements: {
      brands: [],
      ramMin: null,
      processorBrand: null,
      processorFamily: null,
    },
    notes: '',
    status: 'esperando',
  });

  const [selectedBrands, setSelectedBrands] = useState([]);

  // Cargar datos del lead al editar
  useEffect(() => {
    if (lead && isEdit) {
      setFormData({
        clientName: lead.clientName || '',
        whatsapp: lead.whatsapp || '',
        budget: lead.budget || '',
        requirements: {
          brands: lead.requirements?.brands || [],
          ramMin: lead.requirements?.ramMin || null,
          processorBrand: lead.requirements?.processorBrand || null,
          processorFamily: lead.requirements?.processorFamily || null,
        },
        notes: lead.notes || '',
        status: lead.status || 'esperando',
      });
      setSelectedBrands(lead.requirements?.brands || []);
    } else {
      // Reset al crear nuevo
      setFormData({
        clientName: '',
        whatsapp: '',
        budget: '',
        requirements: {
          brands: [],
          ramMin: null,
          processorBrand: null,
          processorFamily: null,
        },
        notes: '',
        status: 'esperando',
      });
      setSelectedBrands([]);
    }
  }, [lead, isEdit, open]);

  const { mutate: createMutation, isLoading: isCreating } = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['matches']);
      onClose();
    },
  });

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation({
    mutationFn: ({ leadId, leadData }) => updateLead(leadId, leadData),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['matches']);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      clientName: formData.clientName.trim(),
      whatsapp: formData.whatsapp.trim(),
      budget: parseFloat(formData.budget),
      requirements: {
        brands: selectedBrands,
        ramMin: formData.requirements.ramMin ? parseInt(formData.requirements.ramMin) : null,
        processorBrand: formData.requirements.processorBrand || null,
        processorFamily: formData.requirements.processorFamily || null,
      },
      notes: formData.notes.trim(),
      status: formData.status,
    };

    if (isEdit && lead) {
      updateMutation({ leadId: lead._id, leadData: payload });
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

  const handleRequirementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value === '' ? null : value,
      },
    }));
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      }
      return [...prev, brand];
    });
  };

  const getProcessorFamilies = () => {
    if (formData.requirements.processorBrand === 'Intel') {
      return INTEL_FAMILIES;
    }
    if (formData.requirements.processorBrand === 'AMD') {
      return AMD_FAMILIES;
    }
    return [];
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal show={open} onClose={onClose} size="2xl">
      <ModalHeader>
        {isEdit ? 'Editar Lead de Cliente' : 'Registrar Nuevo Lead'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName" value="Nombre del Cliente *" />
              <TextInput
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <Label htmlFor="whatsapp" value="WhatsApp *" />
              <TextInput
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+573001234567 o enlace de WhatsApp"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Número o link de WhatsApp
              </p>
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <Label htmlFor="budget" value="Presupuesto Máximo (COP) *" />
            <CurrencyInput
              id="budget"
              name="budget"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="$0"
              decimalsLimit={0}
              value={formData.budget}
              onValueChange={(value) => handleChange('budget', value || '')}
              prefix="$"
              groupSeparator="."
              decimalSeparator=","
              required
            />
          </div>

          {/* Requisitos - Marcas */}
          <div>
            <Label value="Marcas Preferidas" />
            <div className="flex flex-wrap gap-2 mt-2">
              {BRAND_OPTIONS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedBrands.includes(brand)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona todas las marcas que le interesan (opcional)
            </p>
          </div>

          {/* Requisitos - RAM */}
          <div>
            <Label htmlFor="ramMin" value="RAM Mínima Requerida" />
            <Select
              id="ramMin"
              value={formData.requirements.ramMin || ''}
              onChange={(e) => handleRequirementChange('ramMin', e.target.value)}
            >
              {RAM_OPTIONS.map((option) => (
                <option key={option.value || 'null'} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Requisitos - Procesador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processorBrand" value="Marca de Procesador" />
              <Select
                id="processorBrand"
                value={formData.requirements.processorBrand || ''}
                onChange={(e) => {
                  handleRequirementChange('processorBrand', e.target.value);
                  // Reset familia al cambiar marca
                  handleRequirementChange('processorFamily', null);
                }}
              >
                {PROCESSOR_BRANDS.map((option) => (
                  <option key={option.value || 'null'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="processorFamily" value="Familia de Procesador" />
              <Select
                id="processorFamily"
                value={formData.requirements.processorFamily || ''}
                onChange={(e) => handleRequirementChange('processorFamily', e.target.value)}
                disabled={!formData.requirements.processorBrand}
              >
                <option value="">Sin preferencia</option>
                {getProcessorFamilies().map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Estado (solo al editar) */}
          {isEdit && (
            <div>
              <Label htmlFor="status" value="Estado del Lead" />
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="esperando">Esperando</option>
                <option value="contactado">Contactado</option>
                <option value="vendido">Vendido</option>
                <option value="descartado">Descartado</option>
              </Select>
            </div>
          )}

          {/* Notas */}
          <div>
            <Label htmlFor="notes" value="Notas Adicionales" />
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Ej: Prefiere equipos ligeros, necesita para diseño gráfico..."
              rows={3}
            />
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
                <>{isEdit ? 'Actualizar' : 'Guardar Lead'}</>
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default LeadForm;
