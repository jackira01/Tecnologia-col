const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { model, Schema } = mongoose;

const AttributeSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['processors', 'ram', 'storage', 'so', 'brands'],
    },
    value: {
      type: String,
      required: true,
    },
    // Metadata flexible para diferentes tipos de atributos
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Plugin de paginación
AttributeSchema.plugin(mongoosePaginate);

// Índice compuesto para búsquedas eficientes
AttributeSchema.index({ category: 1, active: 1 });
AttributeSchema.index({ category: 1, value: 1 }, { unique: true });

module.exports = model('Attribute', AttributeSchema);
