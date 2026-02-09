'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, Label, TextInput, Badge } from 'flowbite-react';
import { HiX, HiFilter, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import { getAttributesByCategory } from '@/services/attributes';
import { getProducts } from '@/services/products';

// Inline utility function
const formatFilterPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const countActiveFilters = (filters) => {
  let count = 0;
  if (filters.search && filters.search.trim()) count++;
  if (filters.priceMin > 0 || filters.priceMax < 10000000) count++;
  if (filters.disponibility && filters.disponibility.length > 0) count++;
  if (filters.condition && filters.condition.length > 0) count++;
  if (filters.ram?.size && filters.ram.size.length > 0) count++;
  if (filters.ram?.type && filters.ram.type.length > 0) count++;
  if (filters.storage?.type && filters.storage.type.length > 0) count++;
  if (filters.processor?.brand) count++;
  return count;
};

// Generate filter badge descriptions
const getFilterBadges = (filters, priceRange) => {
  const badges = [];
  
  if (filters.search && filters.search.trim()) {
    badges.push({
      id: 'search',
      label: `Búsqueda: "${filters.search}"`,
      onRemove: () => ({ ...filters, search: '' })
    });
  }
  
  if (filters.priceMin > (priceRange?.min || 0) || filters.priceMax < (priceRange?.max || 10000000)) {
    badges.push({
      id: 'price',
      label: `Precio: ${formatFilterPrice(filters.priceMin)} - ${formatFilterPrice(filters.priceMax)}`,
      onRemove: () => ({ 
        ...filters, 
        priceMin: priceRange?.min || 0, 
        priceMax: priceRange?.max || 10000000 
      })
    });
  }
  
  if (filters.disponibility && filters.disponibility.length > 0) {
    const labels = filters.disponibility.map(d => d === 'disponible' ? 'Disponibles' : 'Vendidos');
    badges.push({
      id: 'disponibility',
      label: labels.join(', '),
      onRemove: () => ({ ...filters, disponibility: [] })
    });
  }
  
  if (filters.condition && filters.condition.length > 0) {
    const labels = filters.condition.map(c => c === 'nuevo' ? 'Nuevos' : 'Usados');
    badges.push({
      id: 'condition',
      label: labels.join(', '),
      onRemove: () => ({ ...filters, condition: [] })
    });
  }
  
  if (filters.ram?.size && filters.ram.size.length > 0) {
    badges.push({
      id: 'ram-size',
      label: `RAM: ${filters.ram.size.join(', ')}`,
      onRemove: () => ({ ...filters, ram: { ...filters.ram, size: [] } })
    });
  }
  
  if (filters.ram?.type && filters.ram.type.length > 0) {
    badges.push({
      id: 'ram-type',
      label: `Tipo RAM: ${filters.ram.type.join(', ')}`,
      onRemove: () => ({ ...filters, ram: { ...filters.ram, type: [] } })
    });
  }
  
  if (filters.storage?.type && filters.storage.type.length > 0) {
    badges.push({
      id: 'storage-type',
      label: `Disco: ${filters.storage.type.join(', ')}`,
      onRemove: () => ({ ...filters, storage: { ...filters.storage, type: [] } })
    });
  }
  
  if (filters.processor?.brand) {
    let label = `Procesador: ${filters.processor.brand}`;
    if (filters.processor.family) {
      label += ` ${filters.processor.family}`;
    }
    if (filters.processor.generation) {
      label += ` Gen ${filters.processor.generation}`;
    }
    badges.push({
      id: 'processor',
      label,
      onRemove: () => ({ 
        ...filters, 
        processor: { brand: '', family: '', generation: '' } 
      })
    });
  }
  
  return badges;
};

// Simple collapsible section component
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const FilterPanel = ({ filters = {}, onFilterChange, onClearFilters }) => {
  // Fetch price range from all products
  const { data: allProductsData } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => getProducts({ page: 1, limit: 1000, filters: { active: true } }),
    staleTime: 1000 * 60 * 5,
  });

  // Calculate dynamic price range
  const priceRange = useMemo(() => {
    if (!allProductsData?.docs || allProductsData.docs.length === 0) {
      return { min: 0, max: 10000000 };
    }
    
    const prices = allProductsData.docs
      .map(p => p.price?.sale || 0)
      .filter(p => p > 0);
    
    if (prices.length === 0) {
      return { min: 0, max: 10000000 };
    }
    
    return {
      min: Math.floor(Math.min(...prices) / 100000) * 100000,
      max: Math.ceil(Math.max(...prices) / 100000) * 100000
    };
  }, [allProductsData]);

  const [localFilters, setLocalFilters] = useState({
    search: filters?.search || '',
    priceMin: filters?.priceMin || priceRange.min,
    priceMax: filters?.priceMax || priceRange.max,
    disponibility: filters?.disponibility || [],
    condition: filters?.condition || [],
    ram: {
      size: filters?.ram?.size || [],
      type: filters?.ram?.type || []
    },
    storage: {
      type: filters?.storage?.type || []
    },
    processor: {
      brand: filters?.processor?.brand || '',
      family: filters?.processor?.family || '',
      generation: filters?.processor?.generation || ''
    }
  });

  // Sync local filters with parent filters when they change (e.g., when cleared)
  useEffect(() => {
    setLocalFilters({
      search: filters?.search || '',
      priceMin: filters?.priceMin ?? priceRange.min,
      priceMax: filters?.priceMax ?? priceRange.max,
      disponibility: filters?.disponibility || [],
      condition: filters?.condition || [],
      ram: {
        size: filters?.ram?.size || [],
        type: filters?.ram?.type || []
      },
      storage: {
        type: filters?.storage?.type || []
      },
      processor: {
        brand: filters?.processor?.brand || '',
        family: filters?.processor?.family || '',
        generation: filters?.processor?.generation || ''
      }
    });
  }, [filters, priceRange]);

  // Fetch dynamic filter options
  const { data: ramOptions = [] } = useQuery({
    queryKey: ['attributes', 'ram'],
    queryFn: () => getAttributesByCategory('ram'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: storageOptions = [] } = useQuery({
    queryKey: ['attributes', 'storage'],
    queryFn: () => getAttributesByCategory('storage'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: processorOptions = [] } = useQuery({
    queryKey: ['attributes', 'processors'],
    queryFn: () => getAttributesByCategory('processors'),
    staleTime: 1000 * 60 * 5,
  });

  // Extract unique values safely
  const ramSizes = Array.isArray(ramOptions) 
    ? [...new Set(ramOptions
        .filter(opt => opt && opt.metadata && opt.metadata.size)
        .map(opt => opt.metadata.size)
        .filter(Boolean))]
    : [];
    
  const ramTypes = Array.isArray(ramOptions)
    ? [...new Set(ramOptions
        .filter(opt => opt && opt.metadata && opt.metadata.type)
        .map(opt => opt.metadata.type)
        .filter(Boolean))]
    : [];
    
  const storageTypes = Array.isArray(storageOptions)
    ? [...new Set(storageOptions
        .filter(opt => opt && opt.metadata && opt.metadata.storageType)
        .map(opt => opt.metadata.storageType)
        .filter(Boolean))]
    : [];
    
  const processorBrands = Array.isArray(processorOptions)
    ? [...new Set(processorOptions
        .filter(opt => opt && opt.metadata && opt.metadata.brand)
        .map(opt => opt.metadata.brand)
        .filter(Boolean))]
    : [];

  const processorFamilies = (localFilters.processor?.brand && Array.isArray(processorOptions))
    ? [...new Set(processorOptions
        .filter(opt => 
          opt && 
          opt.metadata && 
          opt.metadata.brand === localFilters.processor.brand && 
          opt.metadata.family
        )
        .map(opt => opt.metadata.family)
        .filter(Boolean))]
    : [];

  const processorGenerations = (localFilters.processor?.family && Array.isArray(processorOptions))
    ? [...new Set(processorOptions
        .filter(opt => 
          opt &&
          opt.metadata &&
          opt.metadata.brand === localFilters.processor.brand &&
          opt.metadata.family === localFilters.processor.family &&
          opt.metadata.generation
        )
        .map(opt => opt.metadata.generation)
        .filter(Boolean))]
    : [];

  const activeFilterCount = countActiveFilters(localFilters);
  const filterBadges = getFilterBadges(localFilters, priceRange);

  const handleLocalChange = (key, value) => {
    const newFilters = { ...localFilters };
    
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = newFilters;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      newFilters[key] = value;
    }

    setLocalFilters(newFilters);
  };

  const handleCheckboxChange = (category, value) => {
    const current = localFilters[category] || [];
    const newValue = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleLocalChange(category, newValue);
  };

  const handleRemoveBadge = (badge) => {
    const newFilters = badge.onRemove();
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiFilter className="text-xl text-gray-900 dark:text-white" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtros
          </h3>
          {activeFilterCount > 0 && (
            <Badge color="blue">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button size="xs" color="gray" onClick={handleClear}>
            <HiX className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {filterBadges.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filterBadges.map(badge => (
            <Badge key={badge.id} color="info" className="flex items-center gap-1">
              <span className="text-xs">{badge.label}</span>
              <button
                onClick={() => handleRemoveBadge(badge)}
                className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
              >
                <HiX className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Search */}
        <CollapsibleSection title="Búsqueda" defaultOpen={true}>
          <TextInput
            placeholder="Buscar por nombre..."
            value={localFilters.search}
            onChange={(e) => handleLocalChange('search', e.target.value)}
          />
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Rango de Precio">
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300">
                Mínimo: {formatFilterPrice(localFilters.priceMin)}
              </Label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={100000}
                value={localFilters.priceMin}
                onChange={(e) => handleLocalChange('priceMin', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300">
                Máximo: {formatFilterPrice(localFilters.priceMax)}
              </Label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={100000}
                value={localFilters.priceMax}
                onChange={(e) => handleLocalChange('priceMax', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Availability */}
        <CollapsibleSection title="Disponibilidad">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible"
                checked={localFilters.disponibility.includes('disponible')}
                onChange={() => handleCheckboxChange('disponibility', 'disponible')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="disponible" className="ml-2 text-sm text-gray-900 dark:text-white">
                Disponible
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="vendido"
                checked={localFilters.disponibility.includes('vendido')}
                onChange={() => handleCheckboxChange('disponibility', 'vendido')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="vendido" className="ml-2 text-sm text-gray-900 dark:text-white">
                Vendido
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Condition */}
        <CollapsibleSection title="Condición">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="nuevo"
                checked={localFilters.condition.includes('nuevo')}
                onChange={() => handleCheckboxChange('condition', 'nuevo')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="nuevo" className="ml-2 text-sm text-gray-900 dark:text-white">
                Nuevo
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="usado"
                checked={localFilters.condition.includes('usado')}
                onChange={() => handleCheckboxChange('condition', 'usado')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="usado" className="ml-2 text-sm text-gray-900 dark:text-white">
                Usado
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* RAM */}
        <CollapsibleSection title="Memoria RAM">
          <div className="space-y-3">
            {ramSizes.length > 0 && (
              <div>
                <Label className="text-sm mb-2 text-gray-900 dark:text-white">Capacidad</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {ramSizes.map(size => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`ram-size-${size}`}
                        checked={(localFilters.ram?.size || []).includes(size)}
                        onChange={() => {
                          const current = localFilters.ram?.size || [];
                          const newValue = current.includes(size)
                            ? current.filter(s => s !== size)
                            : [...current, size];
                          handleLocalChange('ram.size', newValue);
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`ram-size-${size}`} className="ml-2 text-sm text-gray-900 dark:text-white">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ramTypes.length > 0 && (
              <div>
                <Label className="text-sm mb-2 text-gray-900 dark:text-white">Tipo</Label>
                <div className="space-y-2">
                  {ramTypes.map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`ram-type-${type}`}
                        checked={(localFilters.ram?.type || []).includes(type)}
                        onChange={() => {
                          const current = localFilters.ram?.type || [];
                          const newValue = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          handleLocalChange('ram.type', newValue);
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`ram-type-${type}`} className="ml-2 text-sm text-gray-900 dark:text-white">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Storage */}
        <CollapsibleSection title="Almacenamiento">
          {storageTypes.length > 0 && (
            <div>
              <Label className="text-sm mb-2 text-gray-900 dark:text-white">Tipo de Disco</Label>
              <div className="space-y-2">
                {storageTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`storage-type-${type}`}
                      checked={(localFilters.storage?.type || []).includes(type)}
                      onChange={() => {
                        const current = localFilters.storage?.type || [];
                        const newValue = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        handleLocalChange('storage.type', newValue);
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor={`storage-type-${type}`} className="ml-2 text-sm text-gray-900 dark:text-white">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Processor */}
        <CollapsibleSection title="Procesador">
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-900 dark:text-white">Marca</Label>
              <select
                value={localFilters.processor?.brand || ''}
                onChange={(e) => {
                  handleLocalChange('processor.brand', e.target.value);
                  handleLocalChange('processor.family', '');
                  handleLocalChange('processor.generation', '');
                }}
                className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas</option>
                {processorBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            {localFilters.processor?.brand && processorFamilies.length > 0 && (
              <div>
                <Label className="text-sm text-gray-900 dark:text-white">Familia</Label>
                <select
                  value={localFilters.processor?.family || ''}
                  onChange={(e) => {
                    handleLocalChange('processor.family', e.target.value);
                    handleLocalChange('processor.generation', '');
                  }}
                  className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todas</option>
                  {processorFamilies.map(family => (
                    <option key={family} value={family}>{family}</option>
                  ))}
                </select>
              </div>
            )}
            {localFilters.processor?.family && processorGenerations.length > 0 && (
              <div>
                <Label className="text-sm text-gray-900 dark:text-white">Generación</Label>
                <select
                  value={localFilters.processor?.generation || ''}
                  onChange={(e) => handleLocalChange('processor.generation', e.target.value)}
                  className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todas</option>
                  {processorGenerations.map(gen => (
                    <option key={gen} value={gen}>{gen}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* Apply Button */}
      <div className="mt-4">
        <Button onClick={handleApply} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};
