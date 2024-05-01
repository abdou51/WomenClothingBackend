const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/verify", userJwt, userController.verifyJwt);

module.exports = router;
