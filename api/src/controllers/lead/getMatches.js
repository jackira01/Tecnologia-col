import LeadModel from '../../models/Lead.cjs';
import LaptopProductModel from '../../models/laptopProduct.cjs';

/**
 * Verifica si el precio del producto está dentro del rango del presupuesto (±10%)
 */
const checkBudgetMatch = (productPrice, budget) => {
  const minPrice = budget * 0.9;
  const maxPrice = budget * 1.1;
  return productPrice >= minPrice && productPrice <= maxPrice;
};

/**
 * Verifica si la marca coincide con las preferencias
 */
const checkBrandMatch = (productBrand, preferredBrands) => {
  if (!preferredBrands || preferredBrands.length === 0) {
    return true; // Sin preferencia = todas las marcas coinciden
  }
  return preferredBrands.some(
    brand => brand.toLowerCase() === productBrand.toLowerCase()
  );
};

/**
 * Verifica si la RAM es suficiente
 */
const checkRamMatch = (productRam, minRam) => {
  if (!minRam) {
    return true; // Sin requisito = cualquier RAM coincide
  }

  // Extraer número de la RAM del producto (ej: "8GB" -> 8)
  const ramSize = parseInt(productRam.size);
  return ramSize >= minRam;
};

/**
 * Verifica si el procesador coincide
 */
const checkProcessorMatch = (productProcessor, requirements) => {
  if (!requirements.processorBrand && !requirements.processorFamily) {
    return true; // Sin preferencia = cualquier procesador coincide
  }

  let matches = true;

  if (requirements.processorBrand) {
    matches = matches &&
      productProcessor.brand.toLowerCase() === requirements.processorBrand.toLowerCase();
  }

  if (requirements.processorFamily && matches) {
    matches = matches &&
      productProcessor.family?.toLowerCase().includes(requirements.processorFamily.toLowerCase());
  }

  return matches;
};

/**
 * Calcula un score de coincidencia (0-100)
 */
const calculateMatchScore = (product, lead) => {
  let score = 0;
  const checks = [];

  // Presupuesto (40 puntos)
  if (checkBudgetMatch(product.price.sale, lead.budget)) {
    const priceDiff = Math.abs(product.price.sale - lead.budget);
    const diffPercent = (priceDiff / lead.budget) * 100;
    score += 40 - (diffPercent * 2); // Máximo 40 puntos, menos puntos cuanto más alejado
    checks.push({ criteria: 'Presupuesto', match: true, points: 40 });
  } else {
    checks.push({ criteria: 'Presupuesto', match: false, points: 0 });
  }

  // Marca (20 puntos)
  if (checkBrandMatch(product.specification.brand, lead.requirements.brands)) {
    score += 20;
    checks.push({ criteria: 'Marca', match: true, points: 20 });
  } else {
    checks.push({ criteria: 'Marca', match: false, points: 0 });
  }

  // RAM (20 puntos)
  if (checkRamMatch(product.specification.ram, lead.requirements.ramMin)) {
    score += 20;
    checks.push({ criteria: 'RAM', match: true, points: 20 });
  } else {
    checks.push({ criteria: 'RAM', match: false, points: 0 });
  }

  // Procesador (20 puntos)
  if (checkProcessorMatch(product.specification.processor, lead.requirements)) {
    score += 20;
    checks.push({ criteria: 'Procesador', match: true, points: 20 });
  } else {
    checks.push({ criteria: 'Procesador', match: false, points: 0 });
  }

  return { score: Math.round(score), checks };
};

/**
 * Obtener matchmaking de leads con productos
 */
export const getMatches = async (req, res) => {
  try {
    // Obtener leads activos (esperando o contactado)
    const activeLeads = await LeadModel.find({
      status: { $in: ['esperando', 'contactado'] }
    });

    // Obtener productos disponibles
    const availableProducts = await LaptopProductModel.find({
      disponibility: 'disponible'
    });

    // Calcular matches
    const matches = [];

    for (const lead of activeLeads) {
      const leadMatches = [];

      for (const product of availableProducts) {
        const budgetMatch = checkBudgetMatch(product.price.sale, lead.budget);
        const brandMatch = checkBrandMatch(product.specification.brand, lead.requirements.brands);
        const ramMatch = checkRamMatch(product.specification.ram, lead.requirements.ramMin);
        const processorMatch = checkProcessorMatch(product.specification.processor, lead.requirements);

        // Solo incluir si cumple con presupuesto como mínimo
        if (budgetMatch && brandMatch && ramMatch && processorMatch) {
          const matchData = calculateMatchScore(product, lead);

          leadMatches.push({
            productId: product._id,
            productName: product.name,
            productPrice: product.price.sale,
            productBrand: product.specification.brand,
            productRam: product.specification.ram.size,
            productProcessor: `${product.specification.processor.brand} ${product.specification.processor.model}`,
            matchScore: matchData.score,
            matchDetails: matchData.checks,
          });
        }
      }

      // Ordenar por score (mayor a menor)
      leadMatches.sort((a, b) => b.matchScore - a.matchScore);

      if (leadMatches.length > 0) {
        matches.push({
          leadId: lead._id,
          clientName: lead.clientName,
          whatsapp: lead.whatsapp,
          budget: lead.budget,
          requirements: lead.requirements,
          matchingProducts: leadMatches,
          matchCount: leadMatches.length,
          bestMatch: leadMatches[0],
        });
      }
    }

    return res.status(200).json(matches);
  } catch (error) {
    console.error('Error al calcular matches:', error);
    res.status(500).json({ message: 'Error al calcular matches', error: error.message });
  }
};
