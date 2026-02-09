import Expense from '../../models/Expense.cjs';

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({
      success: true,
      data: expense,
      message: 'Gasto creado exitosamente',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el gasto',
      error: error.message,
    });
  }
};

// Get all expenses with filters
const getAllExpenses = async (req, res) => {
  try {
    const { categoria, startDate, endDate } = req.query;
    const filter = {};

    if (categoria) {
      filter.categoria = categoria;
    }

    if (startDate || endDate) {
      filter.fecha = {};
      if (startDate) {
        filter.fecha.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.fecha.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(filter).sort({ fecha: -1 });
    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los gastos',
      error: error.message,
    });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el gasto',
      error: error.message,
    });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: expense,
      message: 'Gasto actualizado exitosamente',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el gasto',
      error: error.message,
    });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Gasto eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el gasto',
      error: error.message,
    });
  }
};

// Get monthly expenses aggregated by category
const getMonthlyExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren los parámetros month y year',
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.aggregate([
      {
        $match: {
          fecha: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$categoria',
          total: { $sum: '$monto' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    const totalExpenses = expenses.reduce((sum, cat) => sum + cat.total, 0);

    res.status(200).json({
      success: true,
      data: {
        month: parseInt(month),
        year: parseInt(year),
        byCategory: expenses,
        total: totalExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los gastos mensuales',
      error: error.message,
    });
  }
};

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyExpenses,
};
