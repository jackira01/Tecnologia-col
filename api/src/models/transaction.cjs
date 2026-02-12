const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['INJECTION', 'WITHDRAWAL'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = model('Transaction', TransactionSchema);
