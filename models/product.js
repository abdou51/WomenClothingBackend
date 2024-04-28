const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const sizeSchema = new mongoose.Schema({
  size: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const colorSchema = new mongoose.Schema({
  hex: {
    type: String,
    required: true,
  },
  images: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  sizes: [sizeSchema],
});

const productSchema = new mongoose.Schema(
  {
    arName: {
      type: String,
      required: true,
    },
    frName: {
      type: String,
      required: true,
    },
    engName: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    colors: [colorSchema],
    arDescription: {
      type: String,
    },
    frDescription: {
      type: String,
    },
    engDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isDrafted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
