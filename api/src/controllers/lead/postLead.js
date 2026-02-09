import LeadModel from '../../models/Lead.cjs';

/**
 * Crear un nuevo lead
 */
export const postLead = async (req, res) => {
  const { clientName, whatsapp, budget, requirements, notes } = req.body;

  // Validar campos requeridos
  if (!clientName || !whatsapp || !budget) {
    return res.status(400).json({
      message: 'Faltan campos requeridos: clientName, whatsapp, budget'
    });
  }

  // Validar presupuesto
  if (budget <= 0) {
    return res.status(400).json({ message: 'El presupuesto debe ser mayor a 0' });
  }

  try {
    const newLead = new LeadModel({
      clientName,
      whatsapp,
      budget,
      requirements: requirements || {},
      notes: notes || '',
      status: 'esperando',
    });

    const savedLead = await newLead.save();
    return res.status(201).json(savedLead);
  } catch (error) {
    console.error('Error al crear lead:', error);
    res.status(500).json({ message: 'Error al crear lead', error: error.message });
  }
};
