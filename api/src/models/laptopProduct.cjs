const mongoose = require('mongoose');
const { default: _ } = require('mongoose-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const { model, Schema } = mongoose;
const STRING_TYPE_REQUIRE = {
  type: String,
  require: true,
};

const NUMBER_TYPE_REQUIRE = {
  type: Number,
  require: true,
};

const STRING_TYPE = {
  type: String,
};

const LaptopProductSchema = new Schema(
  {
    name: STRING_TYPE_REQUIRE,
    disponibility: {
      type: String,
      default: 'disponible',
      enum: ['vendido', 'disponible'],
    },
    status: {
      type: String,
      default: 'activo',
      enum: ['activo', 'inactivo'],
    },
    price: {
      minimun: NUMBER_TYPE_REQUIRE,
      buy: NUMBER_TYPE_REQUIRE,
      sale: NUMBER_TYPE_REQUIRE,
      soldOn: {
        type: Number,
        require: true,
        default: 0,
      },
    },
    image_URL: [String],
    specification: {
      specification_URL: STRING_TYPE,
      condition: {
        type: String,
        enum: ['nuevo', 'usado'],
      },
      charger: {
        type: Boolean,
        default: true,
      },
      battery: {
        type: Boolean,
        default: true,
      },
      so: STRING_TYPE_REQUIRE,
      brand: STRING_TYPE_REQUIRE,
      model: STRING_TYPE,
      screen_size: STRING_TYPE,
      ram: {
        size: STRING_TYPE_REQUIRE,
        ram_type: STRING_TYPE_REQUIRE,
      },
      storage: {
        size: STRING_TYPE_REQUIRE,
        storage_type: STRING_TYPE_REQUIRE,
      },
      processor: {
        brand: STRING_TYPE_REQUIRE,
        model: STRING_TYPE_REQUIRE,
      },
      general_description: STRING_TYPE,
    },
  },
  { timestamps: true },
);

LaptopProductSchema.plugin(mongoosePaginate);

module.exports = model('LaptopProduct', LaptopProductSchema);
