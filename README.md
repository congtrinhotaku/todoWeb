README.md

# 📌 TodoApp

Ứng dụng quản lý công việc cá nhân giúp bạn dễ dàng lập kế hoạch, phân loại, ưu tiên và theo dõi tiến độ hằng ngày.  
Dự án xây dựng bằng **Node.js + Express + MongoDB (Mongoose) + EJS** theo kiến trúc **MVC**.

---

## 🚀 Tính năng chính
- ✅ Đăng ký, đăng nhập và xác thực người dùng  
- 📝 Thêm, sửa, xóa công việc  
- 📂 Phân loại công việc theo nhóm (học tập, gia đình, công việc, …)  
- ⭐ Đánh dấu mức độ ưu tiên (Không quan trọng | Quan trọng | Khẩn cấp)  
- ⏰ Quản lý deadline, thời gian bắt đầu, nhắc nhở công việc  
- 📊 Xem tiến độ theo ngày/tuần/tháng, báo cáo hoàn thành  
- 🔌 Hỗ trợ RESTful API để mở rộng sang mobile/SPA  

---

## 🛠 Công nghệ sử dụng
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- EJS  
- Kiến trúc MVC  

---

## 📂 Cấu trúc thư mục
todoweb/
├── config/          # Cấu hình DB, mailer
├── controllers/     # Xử lý logic
├── middlewares/     # Middleware
├── models/          # Mongoose schema (User, Task, Category)
├── public/          # CSS, JS, hình ảnh tĩnh
├── routes/          # Định tuyến (auth, task, category)
├── views/           # Giao diện EJS
├── app.js           # Entry point
└── .env             # Biến môi trường


---

## ⚙️ Cài đặt & Chạy dự án

# Clone repo
git clone https://github.com/congtrinhotaku/todoWeb.git
cd todoWeb

# Cài dependencies
npm install

# Tạo file .env và cấu hình biến môi trường (ví dụ:)
MONGO_URI=mongodb://localhost:27017/todoapp
PORT=3000
JWT_SECRET=your_secret

# Chạy server
npm start

Ứng dụng sẽ chạy tại: http://localhost:3000

---

## 🤝 Đóng góp
Mọi ý kiến đóng góp và pull request đều được hoan nghênh!  

---

## 📜 Giấy phép
Dự án này được phát hành dưới giấy phép MIT.
