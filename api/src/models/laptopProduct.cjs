const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { model, Schema } = mongoose
const STRING_TYPE_REQUIRE = {
    type: String,
    require: true
}

const NUMBER_TYPE_REQUIRE = {
    type: Number,
    require: true
}

const STRING_TYPE = {
    type: String,
}

const LaptopProductSchema = new Schema(
    {
        name: STRING_TYPE_REQUIRE,
        sale_status: {
            type: String,
            default: "disponible",
            enum: ["vendido", "disponible"],
        },
        price: {
            minimun: NUMBER_TYPE_REQUIRE,
            buy: NUMBER_TYPE_REQUIRE,
            sale: NUMBER_TYPE_REQUIRE
        },
        image_URL: STRING_TYPE_REQUIRE,
        specification: {
            specification_URL: STRING_TYPE,
            product_status: {
                type: String,
                enum: ["nuevo", "usado"]
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
            brand: STRING_TYPE,
            screen_size: STRING_TYPE,
            ram: {
                size: STRING_TYPE_REQUIRE,
                ram_type: STRING_TYPE_REQUIRE
            },
            storage: {
                size: STRING_TYPE_REQUIRE,
                storage_type: STRING_TYPE_REQUIRE
            },
            cpu: {
                brand: STRING_TYPE_REQUIRE,
                model: STRING_TYPE_REQUIRE
            },
            general_description: STRING_TYPE,

        },
        createdOn: STRING_TYPE_REQUIRE


    }
)

LaptopProductSchema.plugin(mongoosePaginate)

module.exports = model("LaptopProduct", LaptopProductSchema)

