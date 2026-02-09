import LaptopProductModel from '../../models/laptopProduct.cjs';

/**
 * Calcula el estado de venta basado en días desde publicación
 */
const calculateSaleStatus = (publishedAt, price) => {
  if (!publishedAt) {
    return {
      status: 'unknown',
      label: 'Sin Fecha',
      badgeColor: 'gray',
      suggestedPrice: price.sale,
      daysPublished: 0,
    };
  }

  const now = new Date();
  const published = new Date(publishedAt);
  const daysSincePublished = Math.floor(
    (now - published) / (1000 * 60 * 60 * 24),
  );

  const totalCost = price.buy + (price.otherExpenses || 0);
  const currentMargin = price.sale - totalCost;

  if (daysSincePublished <= 15) {
    return {
      status: 'optimal',
      label: 'Precio Óptimo',
      badgeColor: 'green',
      suggestedPrice: price.sale,
      daysPublished: daysSincePublished,
      description: 'Producto reciente, mantener precio actual',
    };
  }

  if (daysSincePublished <= 25) {
    const suggestedPrice = totalCost + currentMargin * 0.85;
    return {
      status: 'quick_sale',
      label: 'Venta Rápida',
      badgeColor: 'yellow',
      suggestedPrice: Math.round(suggestedPrice),
      discount: '15% en margen',
      daysPublished: daysSincePublished,
      description: 'Considerar reducción del 15% en el margen',
    };
  }

  if (daysSincePublished <= 35) {
    const suggestedPrice = totalCost + currentMargin * 0.7;
    return {
      status: 'recovery',
      label: 'Recuperación',
      badgeColor: 'orange',
      suggestedPrice: Math.round(suggestedPrice),
      discount: '30% en margen',
      daysPublished: daysSincePublished,
      description: 'Reducción del 30% en el margen recomendada',
    };
  }

  return {
    status: 'critical',
    label: 'Liquidación Crítica',
    badgeColor: 'red',
    suggestedPrice: Math.round(totalCost),
    discount: 'A costo',
    daysPublished: daysSincePublished,
    description: 'Vender a precio de costo para recuperar inversión',
    blink: true,
  };
};

/**
 * Obtener productos con estado de venta calculado
 */
export const getProduct = async (req, res) => {
  const { page, limit } = req.query;
  const filters = req.body;

  if (!page || !limit) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
  };

  try {
    const getProducts = await LaptopProductModel.paginate(filters, options);

    // Agregar estado de venta a cada producto (solo para productos disponibles)
    const productsWithStatus = getProducts.docs.map((product) => {
      const productObj = product.toObject();

      // Solo calcular saleStatus para productos disponibles
      const saleStatus = productObj.disponibility === 'disponible'
        ? calculateSaleStatus(productObj.timeline?.publishedAt, productObj.price)
        : null;

      return {
        ...productObj,
        saleStatus,
      };
    });

    // Reemplazar docs con productos enriquecidos
    const response = {
      ...getProducts,
      docs: productsWithStatus,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
