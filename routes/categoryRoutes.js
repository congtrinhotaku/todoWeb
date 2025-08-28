const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const isAuth = require("../middlewares/auth");

router.post("/",  categoryController.createCategory);

module.exports = router;
