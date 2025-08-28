const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối thành công");
  } catch (err) {
    console.error("❌ lỗi ghi kết nối với nomgodb: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
