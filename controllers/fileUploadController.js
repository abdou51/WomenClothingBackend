const multer = require("multer");
const path = require("path");
const File = require("../models/file");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
}).array("images", 10);

const uploadImage = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No files selected" });
    }
    const fileUrls = req.files.map((file) => file.path.replace(/\\/g, "/"));
    const newFile = new File({ urls: fileUrls });

    await newFile.save();

    res.send({
      message: "Files uploaded and saved successfully",
      files: newFile,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred during upload or database operation",
      error: err,
    });
  }
};

module.exports = {
  uploadImage,
};
