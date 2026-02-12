import LaptopProductModel from '../../models/laptopProduct.cjs';

/**
 * Obtener insights de rentabilidad
 * Analiza productos vendidos para identificar las combinaciones más rentables
 */
export const getProfitabilityInsights = async (req, res) => {
  try {
    const insights = await LaptopProductModel.aggregate([
      // Filtrar solo productos vendidos
      { $match: { disponibility: 'vendido' } },

      // Calcular margen de ganancia y días de venta
      {
        $addFields: {
          profitMargin: {
            $subtract: [
              '$price.soldOn',
              {
                $add: [
                  '$price.buy',
                  { $ifNull: ['$price.otherExpenses', 0] },
                ],
              },
            ],
          },
          daysToSell: {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$timeline.soldAt', null] },
                  { $ne: ['$timeline.publishedAt', null] },
                ],
              },
              then: {
                $divide: [
                  {
                    $subtract: [
                      '$timeline.soldAt',
                      '$timeline.publishedAt',
                    ],
                  },
                  1000 * 60 * 60 * 24,
                ],
              },
              else: null,
            },
          },
        },
      },

      // Filtrar productos con datos válidos
      {
        $match: {
          daysToSell: { $ne: null, $gt: 0 },
          profitMargin: { $gt: 0 },
        },
      },

      // Agrupar por combinación de procesador + RAM
      {
        $group: {
          _id: {
            processorBrand: '$specification.processor.brand',
            ramSize: '$specification.ram.size',
          },
          avgMargin: { $avg: '$profitMargin' },
          avgDaysToSell: { $avg: '$daysToSell' },
          totalSales: { $sum: 1 },
          totalProfit: { $sum: '$profitMargin' },
          minDaysToSell: { $min: '$daysToSell' },
          maxDaysToSell: { $max: '$daysToSell' },
        },
      },

      // Calcular ratio de eficiencia (margen por día)
      {
        $addFields: {
          efficiencyRatio: {
            $divide: ['$avgMargin', '$avgDaysToSell'],
          },
        },
      },

      // Ordenar por mejor ratio de eficiencia
      { $sort: { efficiencyRatio: -1 } },

      // Limitar a top 5
      { $limit: 5 },

      // Formatear resultado
      {
        $project: {
          _id: 0,
          processorBrand: '$_id.processorBrand',
          ramSize: '$_id.ramSize',
          avgMargin: { $round: ['$avgMargin', 0] },
          avgDaysToSell: { $round: ['$avgDaysToSell', 1] },
          totalSales: 1,
          totalProfit: { $round: ['$totalProfit', 0] },
          efficiencyRatio: { $round: ['$efficiencyRatio', 0] },
          minDaysToSell: { $round: ['$minDaysToSell', 1] },
          maxDaysToSell: { $round: ['$maxDaysToSell', 1] },
        },
      },
    ]);

    res.status(200).json({
      insights,
      summary: {
        topCombination:
          insights.length > 0
            ? {
              processor: insights[0].processorBrand,
              ram: insights[0].ramSize,
              avgMargin: insights[0].avgMargin,
              avgDays: insights[0].avgDaysToSell,
              efficiency: insights[0].efficiencyRatio,
            }
            : null,
      },
    });
  } catch (error) {
    console.error('Error calculando insights:', error);
    res.status(500).json({ error: 'Error al calcular insights de rentabilidad' });
  }
};

/**
 * Obtener estadísticas generales de ventas
 */
export const getSalesStats = async (req, res) => {
  try {
    const stats = await LaptopProductModel.aggregate([
      {
        $facet: {
          // Productos disponibles vs vendidos
          availability: [
            {
              $group: {
                _id: '$disponibility',
                count: { $sum: 1 },
              },
            },
          ],

          // Inventario total (Mi Inversión Real)
          totalInventory: [
            {
              $match: { disponibility: 'disponible' },
            },
            {
              $group: {
                _id: null,
                totalValue: {
                  $sum: {
                    $cond: {
                      if: { $eq: ['$acquisitionType', 'co_investment'] },
                      then: '$price.myInvestment',
                      else: {
                        $add: ['$price.buy', { $ifNull: ['$price.otherExpenses', 0] }],
                      },
                    },
                  },
                },
                count: { $sum: 1 },
              },
            },
          ],

          // Ganancias totales (Mi Utilidad Real)
          totalProfit: [
            {
              $match: { disponibility: 'vendido' },
            },
            {
              $addFields: {
                // Costo total de adquisición
                totalAcquisitionCost: {
                  $add: ['$price.buy', { $ifNull: ['$price.otherExpenses', 0] }],
                },
              },
            },
            {
              $addFields: {
                // Utilidad total del equipo
                itemTotalProfit: {
                  $subtract: ['$price.soldOn', '$totalAcquisitionCost'],
                },
                // Porcentaje de participación (100% si no es co-inversión)
                ownershipPercentage: {
                  $cond: {
                    if: { $eq: ['$acquisitionType', 'co_investment'] },
                    then: {
                      $divide: ['$price.myInvestment', '$totalAcquisitionCost'],
                    },
                    else: 1,
                  },
                },
              },
            },
            {
              $group: {
                _id: null,
                totalProfit: {
                  $sum: {
                    $multiply: ['$itemTotalProfit', '$ownershipPercentage'],
                  },
                },
                totalRevenue: { $sum: '$price.soldOn' },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(stats[0]);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
