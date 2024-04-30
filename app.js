const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_API; // Make sure you have your bot token in your environment variables
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/fuckyou/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`Chat ID: ${chatId}`); // This will log the chat ID to your console

  // Optionally, send the chat ID back to the user
  // bot.sendMessage(chatId, `Your chat ID is ${chatId}`);
  bot.sendMessage(chatId, "fuck you too bitch !");
});
// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "ECOMDB",
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Increase the payload limit for JSON data
app.use(express.json());
app.use(morgan("tiny"));

// // Define routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const wilayaRoutes = require("./routes/wilayaRoutes");
const fileRoutes = require("./routes/fileRoutes");
const orderRoutes = require("./routes/orderRoutes");

const api = process.env.API_URL;

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/wilayas", wilayaRoutes);
app.use("/upload", fileRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).json({ message: err });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
