const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendMail = require("../middlewares/mailer");

// ================== FORM ĐĂNG KÝ ==================
exports.getRegister = (req, res) => {
  res.render("auth/dangky", { error: null });
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Nếu user chưa xác thực => xóa để đăng ký lại
        await User.deleteOne({ email });
        console.log("🗑️ Đã xoá user chưa xác thực:", email);
      } else {
        // Nếu user đã xác thực => báo lỗi
        return res.render("auth/dangky", {
          error: "❌ Email đã được sử dụng. Vui lòng dùng email khác.",
        });
      }
    }

    // Tạo user mới
    const user = new User({ username, email, password });
    req.session.pendingEmail = email;

    // Sinh OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 phút

    await user.save();

    // Gửi mail OTP
    await sendMail(email, "Mã OTP xác thực tài khoản", "otpEmail.ejs", {
      username,
      otp,
    });

    res.redirect("/verify");
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.render("auth/dangky", {
      error: "❌ Lỗi đăng ký: " + err.message,
    });
  }
};

// ================== FORM NHẬP OTP ==================
exports.getVerify = (req, res) => {
  const email = req.session.pendingEmail;
  if (!email) return res.redirect("/register");
  res.render("auth/otp", { email, error: null });
};

exports.postVerify = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/otp", {
        email,
        error: "❌ Email không tồn tại.",
      });
    }

    if (user.isVerified) return res.redirect("/login");

    if (!user.otp || user.otpExpires < Date.now()) {
      return res.render("auth/otp", {
        email,
        error: "❌ OTP đã hết hạn, vui lòng đăng ký lại.",
      });
    }

    // So sánh OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.render("auth/otp", {
        email,
        error: "❌ OTP không đúng.",
      });
    }

    // Xác thực thành công
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.redirect("/login");
  } catch (err) {
    res.render("auth/otp", {
      email,
      error: "❌ Lỗi xác thực: " + err.message,
    });
  }
};

// ================== FORM ĐĂNG NHẬP ==================
exports.getLogin = (req, res) => {
  res.render("auth/dangnhap", { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/dangnhap", {
        error: "❌ Email không tồn tại.",
      });
    }

    if (!user.isVerified) {
      return res.render("auth/dangnhap", {
        error: "⚠️ Vui lòng xác thực email trước khi đăng nhập.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("auth/dangnhap", {
        error: "❌ Sai mật khẩu.",
      });
    }

    // Lưu session
    req.session.userId = user._id;
    req.session.user = user;

    res.redirect("/tasks");
  } catch (err) {
    res.render("auth/dangnhap", {
      error: "❌ Lỗi đăng nhập: " + err.message,
    });
  }
};

// ================== ĐĂNG XUẤT ==================
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
