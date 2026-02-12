const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const AttributeSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true, // One document per category
      enum: ['processors', 'ram', 'storage', 'so', 'brands'],
    },
    // Flexible data structure based on category
    // Processors: { brands: [], families: [], generations: [] }
    // RAM: { types: [], sizes: [] }
    // Storage: { types: [], capacities: [] }
    // SO: { versions: [] }
    // Brands: { names: [] }
    data: {
      type: Map,
      of: Schema.Types.Mixed, // Allow strings or objects (for hierarchy)
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = model('Attribute', AttributeSchema);
