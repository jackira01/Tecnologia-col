const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const LoanSchema = new Schema(
  {
    montoInicial: {
      type: Number,
      required: true,
    },
    saldoActual: {
      type: Number,
      required: true,
    },
    tasaInteresMensual: {
      type: Number,
      required: true,
    },
    fechaCorte: {
      type: Number,
      required: true,
      default: 23,
      min: 1,
      max: 31,
    },
    cuotaMensual: {
      type: Number,
      required: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Loan', LoanSchema);
