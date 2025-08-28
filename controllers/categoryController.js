// controllers/categoryController.js
const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      user: req.session.user._id
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Lỗi thêm category:", error);
    res.status(500).json({ error: "Không thể tạo danh mục" });
  }
};
