// Controlador para sumar price.soldOn y price.buy de todos los productos

import laptopProduct from '../../models/laptopProduct.cjs';

export const getSalesSummary = async (req, res) => {
  try {
    const products = await laptopProduct.find();
    let totalSoldOn = 0;
    let totalBuy = 0;
    for (const product of products) {
      if (product.price) {
        totalSoldOn += product.price.soldOn || 0;
        totalBuy += product.price.buy || 0;
      }
    }
    res.json({ totalSoldOn, totalBuy });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen de ventas' });
  }
};
