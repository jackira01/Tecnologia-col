/**
 * Utility functions for product filtering
 */

/**
 * Build filter object for API request
 * @param {Object} filters - Filter state object
 * @returns {Object} - Formatted filter object for backend
 */
export const buildFilterQuery = (filters) => {
  const query = {};

  // Text search
  if (filters.search && filters.search.trim()) {
    query.name = { $regex: filters.search.trim(), $options: 'i' };
  }

  // Price range
  if (filters.priceMin > 0 || filters.priceMax < 10000000) {
    query['price.sale'] = {};
    if (filters.priceMin > 0) {
      query['price.sale'].$gte = filters.priceMin;
    }
    if (filters.priceMax < 10000000) {
      query['price.sale'].$lte = filters.priceMax;
    }
  }

  // Availability
  if (filters.disponibility && filters.disponibility.length > 0) {
    if (filters.disponibility.length === 1) {
      query.disponibility = filters.disponibility[0];
    } else {
      query.disponibility = { $in: filters.disponibility };
    }
  }

  // Condition
  if (filters.condition && filters.condition.length > 0) {
    if (filters.condition.length === 1) {
      query['specification.condition'] = filters.condition[0];
    } else {
      query['specification.condition'] = { $in: filters.condition };
    }
  }

  // RAM filters
  if (filters.ram) {
    if (filters.ram.size && filters.ram.size.length > 0) {
      if (filters.ram.size.length === 1) {
        query['specification.ram.size'] = filters.ram.size[0];
      } else {
        query['specification.ram.size'] = { $in: filters.ram.size };
      }
    }
    if (filters.ram.type && filters.ram.type.length > 0) {
      if (filters.ram.type.length === 1) {
        query['specification.ram.ram_type'] = filters.ram.type[0];
      } else {
        query['specification.ram.ram_type'] = { $in: filters.ram.type };
      }
    }
  }

  // Storage filters
  if (filters.storage) {
    if (filters.storage.type && filters.storage.type.length > 0) {
      query['specification.storage.storage_type'] = { $in: filters.storage.type };
    }
    // Note: Storage capacity range filtering would need backend support for array fields
  }

  // Processor filters
  if (filters.processor) {
    if (filters.processor.brand) {
      query['specification.processor.brand'] = filters.processor.brand;
    }
    if (filters.processor.family) {
      query['specification.processor.family'] = filters.processor.family;
    }
    if (filters.processor.generation) {
      query['specification.processor.generation'] = filters.processor.generation;
    }
  }

  return query;
};

/**
 * Build dashboard filter object
 * @param {Object} filters - Dashboard filter state
 * @returns {Object} - Formatted filter object
 */
export const buildDashboardFilterQuery = (filters) => {
  const query = {};

  if (filters.active !== null && filters.active !== undefined) {
    query.active = filters.active;
  }

  if (filters.disponibility) {
    query.disponibility = filters.disponibility;
  }

  return query;
};

/**
 * Count active filters
 * @param {Object} filters - Filter state object
 * @returns {number} - Number of active filters
 */
export const countActiveFilters = (filters) => {
  let count = 0;

  if (filters.search && filters.search.trim()) count++;
  if (filters.priceMin > 0 || filters.priceMax < 10000000) count++;
  if (filters.disponibility && filters.disponibility.length > 0) count++;
  if (filters.condition && filters.condition.length > 0) count++;
  if (filters.ram?.size && filters.ram.size.length > 0) count++;
  if (filters.ram?.type && filters.ram.type.length > 0) count++;
  if (filters.storage?.type && filters.storage.type.length > 0) count++;
  if (filters.processor?.brand) count++;
  if (filters.processor?.family) count++;
  if (filters.processor?.generation) count++;

  return count;
};

/**
 * Get initial/default filter state
 * @param {number} minPrice - Optional minimum price from products
 * @param {number} maxPrice - Optional maximum price from products
 * @returns {Object} - Default filter state
 */
export const getDefaultFilters = (minPrice = 0, maxPrice = 10000000) => ({
  search: '',
  priceMin: minPrice,
  priceMax: maxPrice,
  disponibility: [],
  condition: [],
  ram: {
    size: [],
    type: []
  },
  storage: {
    capacityMin: 0,
    capacityMax: 2000,
    type: []
  },
  processor: {
    brand: '',
    family: '',
    generation: ''
  }
});

/**
 * Get default dashboard filters
 * @returns {Object} - Default dashboard filter state
 */
export const getDefaultDashboardFilters = () => ({
  active: null,
  disponibility: null
});

/**
 * Format price for display
 * @param {number} price - Price value
 * @returns {string} - Formatted price string
 */
export const formatFilterPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
