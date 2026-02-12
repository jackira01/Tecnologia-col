import TransactionModel from '../../models/transaction.cjs';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find().sort({ date: -1 });

    // Calculate total capital
    const totalCapital = transactions.reduce((sum, txn) => {
      if (txn.type === 'INJECTION') {
        return sum + txn.amount;
      } else if (txn.type === 'WITHDRAWAL') {
        return sum - txn.amount;
      }
      return sum;
    }, 0);

    res.status(200).json({ transactions, totalCapital });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
