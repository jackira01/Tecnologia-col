// Controlador para sumar price.soldOn y price.buy de todos los productos

import laptopProduct from '../../models/laptopProduct.cjs';

export const getSalesSummary = async (req, res) => {
  try {
    const products = await laptopProduct.find(
      {},
      {
        name: 1,
        price: 1,
        metrics: 1,
        timeline: 1,
        'specification.brand': 1,
        active: 1,
        disponibility: 1,
      },
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen de ventas' });
  }
};
