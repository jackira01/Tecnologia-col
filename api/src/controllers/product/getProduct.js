import LaptopProductModel from '../../models/laptopProduct.cjs';

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
    return res.status(200).json(getProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
