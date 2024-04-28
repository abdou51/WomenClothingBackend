const mongoose = require("mongoose");

const wilayaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    homePrice: {
      type: Number,
      default: 0,
    },
    deskPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Wilaya = mongoose.model("Wilaya", wilayaSchema);

module.exports = Wilaya;
