import LaptopProductModel from '../../models/laptopProduct.cjs';

export const getProduct = async (req, res) => {
  const options = {
    page: req.query.page,
    limit: 8,
  };
  try {
    const getProduct = await LaptopProductModel.paginate({}, options);
    res.status(200).json(getProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
