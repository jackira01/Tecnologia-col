'use client';

import { Badge } from 'flowbite-react';

/**
 * Badge de estado de venta basado en días desde publicación
 */
export const SaleStatusBadge = ({ saleStatus }) => {
  if (!saleStatus) return null;

  const colorMap = {
    green: 'success',
    yellow: 'warning',
    orange: 'warning',
    red: 'failure',
    gray: 'gray',
  };

  const badgeClass = saleStatus.blink
    ? 'animate-pulse'
    : '';

  return (
    <div className="flex flex-col gap-1">
      <Badge
        color={colorMap[saleStatus.badgeColor] || 'gray'}
        className={badgeClass}
      >
        {saleStatus.label}
      </Badge>
      {saleStatus.daysPublished > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {saleStatus.daysPublished} día{saleStatus.daysPublished !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

/**
 * Tooltip con detalles del estado de venta
 */
export const SaleStatusTooltip = ({ saleStatus, price }) => {
  if (!saleStatus) return null;

  return (
    <div className="p-3 space-y-2 bg-gray-800 text-white rounded-lg shadow-lg max-w-xs">
      <div>
        <p className="font-semibold text-sm">{saleStatus.label}</p>
        <p className="text-xs text-gray-300">{saleStatus.description}</p>
      </div>
      
      <div className="border-t border-gray-700 pt-2">
        <div className="flex justify-between text-xs">
          <span>Días publicado:</span>
          <span className="font-medium">{saleStatus.daysPublished}</span>
        </div>
        
        {saleStatus.suggestedPrice && (
          <>
            <div className="flex justify-between text-xs">
              <span>Precio actual:</span>
              <span className="font-medium">
                ${price?.sale?.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Precio sugerido:</span>
              <span className="font-medium text-yellow-300">
                ${saleStatus.suggestedPrice.toLocaleString('es-CO')}
              </span>
            </div>
          </>
        )}
        
        {saleStatus.discount && (
          <div className="mt-1 text-xs bg-yellow-900/30 px-2 py-1 rounded">
            <span className="text-yellow-300">
              💡 {saleStatus.discount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
