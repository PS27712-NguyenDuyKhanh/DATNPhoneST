const API_PUBLIC = "http://localhost:8081/api/categories";
const API_ADMIN = "http://localhost:8081/api/admin/categories";

const token = localStorage.getItem("token");


/* ============================= */
/* LOAD CATEGORY CHO USER MENU  */
/* ============================= */

async function loadMenuCategories() {

    try {

        const res = await fetch(API_PUBLIC);
        const categories = await res.json();

        const menu = document.getElementById("categoryMenu");

        if (!menu) return;

        menu.innerHTML = "";

        categories.forEach(c => {

            menu.insertAdjacentHTML("beforeend", `
                <a href="products.html?category=${c.id}">
                    ${c.name}
                </a>
            `);

        });

    } catch (err) {

        console.error("Lỗi load menu category", err);

    }

}


/* ============================= */
/* LOAD CATEGORY CHO ADMIN      */
/* ============================= */

async function loadAdminCategories() {

    try {

        const res = await fetch(API_ADMIN, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const categories = await res.json();

        const table = document.getElementById("categoryTable");

        if (!table) return;

        table.innerHTML = "";

        categories.forEach(c => {

            table.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>

                        <button onclick="updateCategory(${c.id})">
                            <i class="fa fa-pen"></i>
                        </button>

                        <button onclick="deleteCategory(${c.id})">
                            <i class="fa fa-trash"></i>
                        </button>

                    </td>
                </tr>
            `);

        });

    } catch (err) {

        console.error("Lỗi load admin categories", err);

    }

}


/* ============================= */
/* THÊM CATEGORY                 */
/* ============================= */

async function addCategory() {

    const name = document.getElementById("name").value;

    await fetch(API_ADMIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name })
    });

    loadAdminCategories();

}


/* ============================= */
/* XOÁ CATEGORY                  */
/* ============================= */

async function deleteCategory(id) {

    if (!confirm("Xóa danh mục này?")) return;

    await fetch(`${API_ADMIN}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadAdminCategories();

}


/* ============================= */
/* CẬP NHẬT CATEGORY             */
/* ============================= */

async function updateCategory(id) {

    const name = prompt("Nhập tên danh mục mới");

    if (!name) return;

    await fetch(`${API_ADMIN}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name })
    });

    loadAdminCategories();

}


/* ============================= */
/* AUTO LOAD                     */
/* ============================= */

loadMenuCategories();
loadAdminCategories();