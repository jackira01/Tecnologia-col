'use client';

import { Modal, ModalHeader, ModalBody, Badge as FlowbiteBadge } from 'flowbite-react';
import { Badge } from '@tremor/react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const MatchesModal = ({ open, onClose, leadId, matches }) => {
  const leadMatch = matches?.find((m) => m.leadId === leadId);

  if (!leadMatch) {
    return null;
  }

  return (
    <Modal show={open} onClose={onClose} size="3xl">
      <ModalHeader>
        Productos que coinciden para {leadMatch.clientName}
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          {/* Información del lead */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Requisitos del Cliente:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Presupuesto:</span>{' '}
                <span className="text-green-600 font-semibold">
                  {formatCurrency(leadMatch.budget)}
                </span>
              </div>
              {leadMatch.requirements?.brands?.length > 0 && (
                <div>
                  <span className="font-medium">Marcas:</span>{' '}
                  {leadMatch.requirements.brands.join(', ')}
                </div>
              )}
              {leadMatch.requirements?.ramMin && (
                <div>
                  <span className="font-medium">RAM mínima:</span>{' '}
                  {leadMatch.requirements.ramMin}GB
                </div>
              )}
              {leadMatch.requirements?.processorBrand && (
                <div>
                  <span className="font-medium">Procesador:</span>{' '}
                  {leadMatch.requirements.processorBrand}
                  {leadMatch.requirements.processorFamily && ` ${leadMatch.requirements.processorFamily}`}
                </div>
              )}
            </div>
          </div>

          {/* Lista de productos coincidentes */}
          <div>
            <h3 className="font-semibold mb-3">
              {leadMatch.matchingProducts.length} Producto{leadMatch.matchingProducts.length !== 1 ? 's' : ''} Encontrado{leadMatch.matchingProducts.length !== 1 ? 's' : ''}:
            </h3>
            <div className="space-y-3">
              {leadMatch.matchingProducts.map((product) => (
                <div
                  key={product.productId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {product.productName}
                      </h4>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <FlowbiteBadge color="info" size="xs">
                          {product.productBrand}
                        </FlowbiteBadge>
                        <FlowbiteBadge color="purple" size="xs">
                          {product.productRam}
                        </FlowbiteBadge>
                        <FlowbiteBadge color="pink" size="xs">
                          {product.productProcessor}
                        </FlowbiteBadge>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(product.productPrice)}
                      </div>
                      <Badge color="green" size="sm">
                        Match: {product.matchScore}%
                      </Badge>
                    </div>
                  </div>

                  {/* Detalles del match */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {product.matchDetails.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className={detail.match ? 'text-green-500' : 'text-red-500'}>
                            {detail.match ? '✓' : '✗'}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {detail.criteria}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mejor match destacado */}
          {leadMatch.bestMatch && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                  Mejor Coincidencia
                </h3>
              </div>
              <p className="text-sm">
                <span className="font-medium">{leadMatch.bestMatch.productName}</span> con{' '}
                <span className="font-semibold text-orange-600">
                  {leadMatch.bestMatch.matchScore}% de coincidencia
                </span>
              </p>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MatchesModal;
