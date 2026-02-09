import Loan from '../../models/Loan.cjs';

// Create a new loan
const createLoan = async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json({
      success: true,
      data: loan,
      message: 'Préstamo creado exitosamente',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el préstamo',
      error: error.message,
    });
  }
};

// Get all loans
const getAllLoans = async (req, res) => {
  try {
    const { activo } = req.query;
    const filter = activo !== undefined ? { activo: activo === 'true' } : {};

    const loans = await Loan.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los préstamos',
      error: error.message,
    });
  }
};

// Get loan by ID
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el préstamo',
      error: error.message,
    });
  }
};

// Update loan
const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: loan,
      message: 'Préstamo actualizado exitosamente',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el préstamo',
      error: error.message,
    });
  }
};

// Delete loan (soft delete)
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: loan,
      message: 'Préstamo desactivado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el préstamo',
      error: error.message,
    });
  }
};

// Simulate extra payment
const simulatePayment = async (req, res) => {
  try {
    const { loanId, extraPayment } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado',
      });
    }

    const P = loan.saldoActual; // Principal actual
    const r = loan.tasaInteresMensual / 100; // Tasa mensual en decimal
    const M = loan.cuotaMensual; // Cuota mensual

    // Calcular meses restantes con la fórmula de amortización
    // n = -log(1 - (P * r / M)) / log(1 + r)
    const monthsRemaining = Math.ceil(
      -Math.log(1 - (P * r / M)) / Math.log(1 + r)
    );

    // Calcular intereses totales sin abono extra
    const totalInterestWithout = (M * monthsRemaining) - P;

    // Nuevo principal después del abono extra
    const newPrincipal = P - extraPayment;

    if (newPrincipal <= 0) {
      return res.status(200).json({
        success: true,
        data: {
          monthsReduced: monthsRemaining,
          interestSaved: totalInterestWithout,
          newPayoffDate: new Date(),
          message: '¡El abono cubre toda la deuda!',
        },
      });
    }

    // Calcular nuevos meses restantes
    const newMonthsRemaining = Math.ceil(
      -Math.log(1 - (newPrincipal * r / M)) / Math.log(1 + r)
    );

    // Calcular intereses totales con abono extra
    const totalInterestWith = (M * newMonthsRemaining) - newPrincipal;

    // Calcular ahorro y reducción de tiempo
    const interestSaved = totalInterestWithout - totalInterestWith;
    const monthsReduced = monthsRemaining - newMonthsRemaining;

    // Calcular nueva fecha de pago final
    const today = new Date();
    const newPayoffDate = new Date(today);
    newPayoffDate.setMonth(newPayoffDate.getMonth() + newMonthsRemaining);

    res.status(200).json({
      success: true,
      data: {
        currentBalance: P,
        extraPayment: extraPayment,
        newBalance: newPrincipal,
        monthsRemaining: monthsRemaining,
        newMonthsRemaining: newMonthsRemaining,
        monthsReduced: monthsReduced,
        totalInterestWithout: Math.round(totalInterestWithout),
        totalInterestWith: Math.round(totalInterestWith),
        interestSaved: Math.round(interestSaved),
        newPayoffDate: newPayoffDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al simular el pago',
      error: error.message,
    });
  }
};

export {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  simulatePayment,
};
