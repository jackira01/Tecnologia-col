import { format } from '@formkit/tempo';
import LaptopProductModel from '../../models/laptopProduct.cjs';

export const postProduct = async (req, res) => {
  const data = req.body;
  try {
    const currentDate = new Date();
    const parseDate = format(currentDate, 'YYYY-MM-DD', 'es');
    const newData = {
      ...data,
      createdOn: parseDate,
    };
    const createProduct = await LaptopProductModel.create(newData);
    res
      .status(201)
      .json({ product: createProduct, message: 'Creado con exito' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
