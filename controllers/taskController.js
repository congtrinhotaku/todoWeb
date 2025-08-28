const Task = require("../models/Task");
const Category = require("../models/Category");

// ================== [GET] DANH SÁCH TASK ==================
exports.getTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    let { category, date, range } = req.query;
    let query = { user: req.session.user._id };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Nếu lọc theo category
    if (category) query.category = category;

    // Nếu có lọc theo ngày + range
    if (date && range && range !== "all") {
      let start, end;
      const selectedDate = new Date(date);

      if (range === "day") {
        start = new Date(selectedDate.setHours(0, 0, 0, 0));
        end = new Date(selectedDate.setHours(23, 59, 59, 999));
      } 
      else if (range === "week") {
        // Lấy thứ trong tuần (0=CN,...6=Thứ 7)
        const day = selectedDate.getDay();
        const diff = day === 0 ? 6 : day - 1; // tính thứ 2 là đầu tuần

        start = new Date(selectedDate);
        start.setDate(selectedDate.getDate() - diff);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } 
      else if (range === "month") {
        start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
      }

      query.deadline = { $gte: start, $lte: end };
    }

    const tasks = await Task.find(query)
      .populate("category")
      .lean();

    const categories = await Category.find().lean();

    const groupedTasks = {
      todo: tasks.filter(t => t.status === "Chưa làm"),
      doing: tasks.filter(t => t.status === "Đang làm"),
      done: tasks.filter(t => t.status === "Hoàn thành"),
      postponed: tasks.filter(t => t.status === "Hoãn")
    };

    res.render("tasks/layouts/main", {
      title: "Quản lý công việc",
      body: "../index",
      tasks: groupedTasks,
      categories,
      user: req.session.user,
      selectedCategory: category || "",
      selectedDate: date || todayStr,   // nếu không có query thì dùng ngày hôm nay
      selectedRange: range || "all",
      todayStr                          // dùng để set default cho input date
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách task:", error);
    res.status(500).send("Lỗi server!");
  }
};






// ================== [GET] HIỂN THỊ FORM THÊM TASK ==================
exports.getAddTask = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    // Lấy categories để render vào select
    const categories = await Category.find().lean();

    res.render("tasks/layouts/main", {
      title: "Thêm công việc mới",
      body: "../addnew",         // View add.ejs (form thêm task)
      categories,             // gửi cho form
      user: req.session.user
    });
  } catch (error) {
    console.error("❌ Lỗi khi mở form thêm task:", error);
    res.status(500).send("Lỗi server!");
  }
};
// ================== [POST] XỬ LÝ THÊM TASK ==================
exports.postAddTask = async (req, res) => {
  try {
    const { title, description, category, priority, deadline, status } = req.body;
    await Task.create({
      title,
      description,
      category: category || null,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      status: status || "Chưa làm",
      user: req.session.user._id
    });
    res.redirect("/tasks");
  } catch (err) {
    console.error("Lỗi tạo task:", err);
    res.status(500).send("Lỗi server");
  }
};
// ================== [GET] HIỂN THỊ FORM SỬA TASK ==================
exports.getEditTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.session.user._id });
    const categories = await Category.find({ user: req.session.user._id });
    if (!task) return res.status(404).send("Không tìm thấy công việc");

    res.render("tasks/layouts/main", {
      title: "Sửa công việc",
      body: "../edit",
      task,
      categories,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi tải trang sửa");
  }
};

// ================== [POST] XỬ LÝ SỬA TASK ==================
exports.postEditTask = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.category || data.category === "") {
      data.category = null;
    }

    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      data,
      { new: true, runValidators: true } 
    );

    res.redirect("/tasks");
  } catch (err) {
    console.error("Lỗi khi sửa task:", err);
    res.status(500).send("Không thể sửa task!");
  }
};

// ================== [POST] XÓA TASK ==================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.session.user._id 
    });

    if (!task) {
      return res.status(404).send("Không tìm thấy task hoặc bạn không có quyền.");
    }

    res.redirect("/tasks");
  } catch (error) {
    console.error("Lỗi khi xóa task:", error);
    res.status(500).send("Lỗi server khi xóa task!");
  }
};


// ================== [POST] CẬP NHẬT TRẠNG THÁI TASK ==================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { status });
    res.redirect("/tasks");
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).send("Lỗi server");
  }
};
