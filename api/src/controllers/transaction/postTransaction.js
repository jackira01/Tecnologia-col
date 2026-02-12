import TransactionModel from '../../models/transaction.cjs';

export const postTransaction = async (req, res) => {
  try {
    const { type, amount, description, date } = req.body;

    // Ensure amount is positive and stored correctly based on type
    // Or just store the amount as is?
    // If we want to sum them up later:
    // INJECTION: +amount
    // WITHDRAWAL: -amount
    // Let's store amount as positive number and type determines sign for calculation, 
    // OR store signed amount?
    // The model has 'type' enum.

    // Validation
    if (!amount || !type || !description) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newTransaction = await TransactionModel.create({
      type,
      amount, // We will store positive amount here
      description,
      date: date || new Date(),
    });

    res.status(201).json({
      transaction: newTransaction,
      message: 'Transacción creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
