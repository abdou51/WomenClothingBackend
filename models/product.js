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

const colorSchema = new mongoose.Schema(
  {
    hex: {
      type: String,
      required: true,
    },
    images: {
      urls: [
        {
          type: String,
          get: (url) => {
            const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
            return baseUrl + url;
          },
        },
      ],
    },
    sizes: [sizeSchema],
  },
  {
    toJSON: { getters: true, virtuals: true }, // Ensure to enable getters here
    toObject: { getters: true, virtuals: true },
  }
);

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
