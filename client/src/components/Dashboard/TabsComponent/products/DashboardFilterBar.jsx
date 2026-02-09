'use client';

import { Button, Badge } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useMemo } from 'react';

export const DashboardFilterBar = ({ filters, onFilterChange, onClearFilters, products = [] }) => {
  // Count products for each filter
  const counts = useMemo(() => {
    // Ensure products is an array
    const productList = Array.isArray(products) ? products : [];
    
    return {
      active: productList.filter(p => p.active).length,
      inactive: productList.filter(p => !p.active).length,
      disponible: productList.filter(p => p.disponibility === 'disponible').length,
      vendido: productList.filter(p => p.disponibility === 'vendido').length,
    };
  }, [products]);

  const hasActiveFilters = filters.active !== null || filters.disponibility !== null;

  const handleActiveFilter = (value) => {
    onFilterChange({
      ...filters,
      active: filters.active === value ? null : value
    });
  };

  const handleDisponibilityFilter = (value) => {
    onFilterChange({
      ...filters,
      disponibility: filters.disponibility === value ? null : value
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      {/* Active/Inactive Filters */}
      <div className="flex gap-2">
        <Button
          color={filters.active === true ? 'success' : 'gray'}
          onClick={() => handleActiveFilter(true)}
          size="sm"
        >
          Activos
          <Badge color="success" className="ml-2">
            {counts.active}
          </Badge>
        </Button>
        <Button
          color={filters.active === false ? 'failure' : 'gray'}
          onClick={() => handleActiveFilter(false)}
          size="sm"
        >
          Inactivos
          <Badge color="failure" className="ml-2">
            {counts.inactive}
          </Badge>
        </Button>
      </div>

      {/* Disponibility Filters */}
      <div className="flex gap-2">
        <Button
          color={filters.disponibility === 'disponible' ? 'info' : 'gray'}
          onClick={() => handleDisponibilityFilter('disponible')}
          size="sm"
        >
          Disponibles
          <Badge color="info" className="ml-2">
            {counts.disponible}
          </Badge>
        </Button>
        <Button
          color={filters.disponibility === 'vendido' ? 'warning' : 'gray'}
          onClick={() => handleDisponibilityFilter('vendido')}
          size="sm"
        >
          Vendidos
          <Badge color="warning" className="ml-2">
            {counts.vendido}
          </Badge>
        </Button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          color="gray"
          onClick={onClearFilters}
          size="sm"
        >
          <HiX className="mr-1" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  );
};
