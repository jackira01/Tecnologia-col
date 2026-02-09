import LeadModel from '../../models/Lead.cjs';

/**
 * Obtener leads con paginación y filtros
 */
export const getLeads = async (req, res) => {
  const { page, limit, status } = req.query;

  if (!page || !limit) {
    return res.status(400).json({ message: 'Faltan parámetros de paginación' });
  }

  // Construir filtros
  const filters = {};
  if (status && status !== 'all') {
    filters.status = status;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  try {
    const leads = await LeadModel.paginate(filters, options);
    return res.status(200).json(leads);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    res.status(500).json({ message: 'Error al obtener leads', error: error.message });
  }
};
