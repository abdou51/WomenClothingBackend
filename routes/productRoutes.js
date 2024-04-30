const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const userJwt = require("../middlewares/userJwt");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.put("/:id", productController.updateProduct);
router.get("/:id", productController.getOneProduct);

module.exports = router;
