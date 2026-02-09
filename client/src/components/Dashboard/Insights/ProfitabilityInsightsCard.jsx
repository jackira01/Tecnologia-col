'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfitabilityInsights } from '@/services/insights';
import { Card, Spinner } from 'flowbite-react';
import { HiLightBulb, HiTrendingUp, HiClock } from 'react-icons/hi';

/**
 * Tarjeta de insights de rentabilidad
 * Muestra la combinación más rentable de procesador + RAM
 */
export const ProfitabilityInsightsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profitability-insights'],
    queryFn: getProfitabilityInsights,
    refetchInterval: 1000 * 60 * 5, // Refrescar cada 5 minutos
    staleTime: 1000 * 60 * 3,
  });

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-center items-center h-32">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (isError || !data?.summary?.topCombination) {
    return null; // No mostrar nada si no hay datos
  }

  const { topCombination } = data.summary;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-yellow-500/10 rounded-lg">
          <HiLightBulb className="w-8 h-8 text-yellow-500" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            💡 Sugerencia de Compra Óptima
          </h3>
          
          <div className="space-y-3">
            {/* Combinación recomendada */}
            <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Combinación más rentable:
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {topCombination.processor} + {topCombination.ram}
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-center mb-1">
                  <HiTrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Margen Promedio
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  ${topCombination.avgMargin.toLocaleString('es-CO')}
                </p>
              </div>

              <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-center mb-1">
                  <HiClock className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Días Promedio
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {topCombination.avgDays} días
                </p>
              </div>

              <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-center mb-1">
                  <HiTrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Eficiencia
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  ${topCombination.efficiency.toLocaleString('es-CO')}/día
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Basado en productos vendidos. Esta combinación genera el mejor retorno por día.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
