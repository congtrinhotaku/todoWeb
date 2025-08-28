const transporter = require("../config/mailer");
const ejs = require("ejs");
const path = require("path");

async function sendMail(to, subject, template, data) {
  try {
    const templatePath = path.join(__dirname, "../views/emails", template);

    // render EJS thành HTML
    const html = await ejs.renderFile(templatePath, data);

    await transporter.sendMail({
      from: '"Todo App" <no-reply@todoapp.com>',
      to,
      subject,
      html
    });

    console.log("📧 Email đã gửi đến:", to);
  } catch (err) {
    console.error("❌ Lỗi gửi email:", err.message);
    throw err;
  }
}

module.exports = sendMail;
