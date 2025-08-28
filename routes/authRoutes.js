const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/verify", authController.getVerify);
router.post("/verify", authController.postVerify);

router.get("/", authController.getLogin);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

module.exports = router;
