const Product = require("../models/product"); // Adjust the path as necessary

const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const newProduct = new Product({ ...req.body });
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Error creating product", details: error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: "category" }, { path: "colors.images" }],
    };
    const query = {
      isDrafted: false,
    };
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (name) {
      query.engName = { $regex: new RegExp(name, "i") }; // Add name filter with regex
    }

    const products = await Product.paginate(query, options);
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Products.");
  }
};
const updateProduct = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const productData = { ...req.body };
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
      }
    ).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Product",
    });
    console.error(error);
  }
};
const getOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId)
      .populate("category")
      .populate("image1")
      .populate("image2");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    if (product.image1) {
      product.image1.url = baseUrl + product.image1.url;
    }
    if (product.image2) {
      product.image2.url = baseUrl + product.image2.url;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error getting Product" });
  }
};

module.exports = {
  getAllProducts,
  updateProduct,
  getOneProduct,
  createProduct,
};
