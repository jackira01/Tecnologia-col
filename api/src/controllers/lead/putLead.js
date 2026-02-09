import LeadModel from '../../models/Lead.cjs';

/**
 * Actualizar un lead existente
 */
export const putLead = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID de lead requerido' });
  }

  try {
    const updatedLead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }

    return res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Error al actualizar lead:', error);
    res.status(500).json({ message: 'Error al actualizar lead', error: error.message });
  }
};
