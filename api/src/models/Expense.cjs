const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const ExpenseSchema = new Schema(
  {
    monto: {
      type: Number,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
      enum: ['transporte', 'servicios', 'repuestos', 'publicidad', 'seguros', 'otros'],
    },
    descripcion: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    comprobante: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model('Expense', ExpenseSchema);
