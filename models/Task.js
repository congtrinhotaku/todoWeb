const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null // ✅ Cho phép null
  },

  priority: {
    type: String,
    enum: ["Không quan trọng", "Quan trọng", "Khẩn cấp"],
    default: "Không quan trọng"
  },

  status: {
    type: String,
    enum: ["Chưa làm", "Đang làm", "Hoàn thành", "Hoãn"],
    default: "Chưa làm"
  },

  startTime: Date,
  deadline: Date,
  duration: Number,
  reminder: Number,

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
