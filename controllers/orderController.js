const Order = require("../models/order");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_API; // Your Telegram bot token from BotFather
const createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body };
    const newOrder = new Order(orderData);
    const createdOrder = await newOrder.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: "Error creating Order" });
    console.error(error);
  }
};

const getOrders = async (req, res) => {
  const userRole = req.user.role;

  try {
    let query;

    if (userRole === "Admin") {
      query = Order.find({ isConfirmed: true });
    } else {
      query = Order.find({ isConfirmed: false });
    }

    const orders = await query
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error getting Orders" });
    console.error(error);
  }
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error updating Order" });
  }
};
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Order" });
  }
};
const sendTelegramMessage = async (req, res) => {
  try {
    const bot = new TelegramBot(token, { polling: false });
    const { message } = req.body;
    const chatId = "5096403407"; // Your Telegram chat ID

    bot
      .sendMessage(chatId, message)
      .then((response) => {
        console.log("Message sent", response);
        res.status(200).send("Message sent successfully");
      })
      .catch((err) => {
        console.error("Failed to send message", err);
        res.status(500).send("Failed to send message");
      });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  sendTelegramMessage,
};
