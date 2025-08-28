const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const isAuth = require("./middlewares/auth");
const methodOverride = require("method-override");




// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,   // đồng bộ với db.js
    ttl: 14 * 24 * 60 * 60
  })
}));


// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/", authRoutes);       // đăng nhập/đăng ký
app.use("/tasks",isAuth, taskRoutes);     // quản lý công việc
app.use("/categories", categoryRoutes); // quản lý phân loại 

// 404 handler
app.use((req, res) => {
  const err = new Error("Trang không tồn tại");
  err.status = 404;
  res.status(404).render("error", { message: err.message, error: err });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đã chạy tại http://localhost:${PORT}`);
});

module.exports = app;
