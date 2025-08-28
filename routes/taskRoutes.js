const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Xem tất cả task
router.get("/", taskController.getTasks);

// Thêm mới task
router.get("/new", taskController.getAddTask);      
router.post("/", taskController.postAddTask); 

// Form sửa
router.get("/:id/edit", taskController.getEditTask);
router.post("/edit/:id", taskController.postEditTask);

// Xóa
router.delete("/:id",  taskController.deleteTask);


//tatus
router.post("/:id/status", taskController.updateStatus);


module.exports = router;
