const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // mỗi user tự tạo category
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", categorySchema);
