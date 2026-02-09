const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { model, Schema } = mongoose;

const LeadSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    requirements: {
      brands: {
        type: [String],
        default: [],
      },
      ramMin: {
        type: Number,
        default: null,
      },
      processorBrand: {
        type: String,
        enum: ['Intel', 'AMD', null],
        default: null,
      },
      processorFamily: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ['esperando', 'contactado', 'vendido', 'descartado'],
      default: 'esperando',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

LeadSchema.plugin(mongoosePaginate);

module.exports = model('Lead', LeadSchema);
