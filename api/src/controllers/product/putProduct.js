import laptopProduct from "../../models/laptopProduct.cjs"

export const putProduct = async (req, res) => {
    const { id } = req.params
    const data = req.body
    // Opción para devolver el documento actualizado
    const options = { new: true };
    try {
        const updateProduct = await laptopProduct.findByIdAndUpdate(id, data, options)
        res.status(201).json({ product: updateProduct, message: "Actualizado con exito" })
    } catch (error) {
        res.status(500).json({ message: error })

    }
}