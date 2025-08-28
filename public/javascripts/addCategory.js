document.addEventListener("DOMContentLoaded", () => {
  const btnSave = document.getElementById("btnSaveCategory");
  const input = document.getElementById("newCategory");
  const select = document.getElementById("category");

  btnSave.addEventListener("click", async () => {
    const name = input.value.trim();
    if (!name) return alert("Vui lòng nhập tên danh mục");

    try {
      const res = await fetch("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error("Thêm thất bại");

      const cat = await res.json();

      // Thêm vào select
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.name;
      option.selected = true;
      select.appendChild(option);

      // Reset input
      input.value = "";

      // Đóng modal
      bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();

    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi thêm danh mục");
    }
  });
});
