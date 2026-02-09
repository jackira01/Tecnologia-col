import AttributeModel from '../../models/Attribute.cjs';

/**
 * Obtener atributos con paginación y filtros
 */
export const getAttributes = async (req, res) => {
  const { page, limit } = req.query;
  const filters = req.body;

  if (!page || !limit) {
    return res.status(400).json({ message: 'Faltan datos de paginación' });
  }

  const options = {
    page,
    limit,
    sort: { category: 1, value: 1 },
  };

  try {
    const attributes = await AttributeModel.paginate(filters, options);
    return res.status(200).json(attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener atributos' });
  }
};

/**
 * Obtener atributos por categoría (sin paginación, para selects)
 */
export const getAttributesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const attributes = await AttributeModel.find({
      category,
      active: true,
    }).sort({ value: 1 });

    return res.status(200).json(attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener atributos por categoría' });
  }
};

/**
 * Crear nuevo atributo
 */
export const createAttribute = async (req, res) => {
  const data = req.body;

  try {
    // Validar que la categoría sea válida
    const validCategories = ['processors', 'ram', 'storage', 'so', 'brands'];
    if (!validCategories.includes(data.category)) {
      return res.status(400).json({
        message: 'Categoría inválida',
      });
    }

    // Verificar duplicados
    const existing = await AttributeModel.findOne({
      category: data.category,
      value: data.value,
    });

    if (existing) {
      return res.status(409).json({
        message: 'Ya existe un atributo con ese valor en esta categoría',
      });
    }

    const newAttribute = await AttributeModel.create(data);
    res.status(201).json({
      attribute: newAttribute,
      message: 'Atributo creado con éxito',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear atributo' });
  }
};

/**
 * Actualizar atributo existente
 */
export const updateAttribute = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Verificar que el atributo existe
    const attribute = await AttributeModel.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: 'Atributo no encontrado' });
    }

    // Si se está cambiando el valor, verificar duplicados
    if (data.value && data.value !== attribute.value) {
      const existing = await AttributeModel.findOne({
        category: attribute.category,
        value: data.value,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(409).json({
          message: 'Ya existe un atributo con ese valor en esta categoría',
        });
      }
    }

    const updatedAttribute = await AttributeModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      attribute: updatedAttribute,
      message: 'Atributo actualizado con éxito',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar atributo' });
  }
};

/**
 * Eliminar atributo (soft delete)
 */
export const deleteAttribute = async (req, res) => {
  const { id } = req.params;

  try {
    const attribute = await AttributeModel.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: 'Atributo no encontrado' });
    }

    // Soft delete: marcar como inactivo
    await AttributeModel.findByIdAndUpdate(id, { active: false });

    res.status(200).json({
      message: 'Atributo eliminado con éxito',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar atributo' });
  }
};

/**
 * Eliminar permanentemente un atributo
 */
export const hardDeleteAttribute = async (req, res) => {
  const { id } = req.params;

  try {
    const attribute = await AttributeModel.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: 'Atributo no encontrado' });
    }

    await AttributeModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Atributo eliminado permanentemente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar atributo' });
  }
};
