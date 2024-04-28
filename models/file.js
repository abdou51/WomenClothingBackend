const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    urls: [
      {
        type: String,
        get: (url) => {
          const baseUrl = process.env.BASE_URL;
          return baseUrl + url;
        },
      },
    ],
  },
  { timestamps: true, versionKey: false, toJSON: { getters: true } }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
