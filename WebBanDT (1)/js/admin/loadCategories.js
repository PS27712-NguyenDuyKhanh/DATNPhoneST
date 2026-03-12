const API_ADMIN = "http://localhost:8081/api/admin/categories";
const token = localStorage.getItem("token");

let editingId = null;




async function loadAdminCategories() {

    const res = await fetch(API_ADMIN, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const categories = await res.json();

    const table = document.getElementById("categoryTable");
    const parent = document.getElementById("parent");

    table.innerHTML = "";
    parent.innerHTML = `<option value="">Danh mục cha</option>`;

    categories.forEach(c => {

        parent.innerHTML += `
            <option value="${c.id}">
                ${c.name}
            </option>
        `;

        table.insertAdjacentHTML("beforeend", `
            <tr>

                <td>${c.id}</td>

                <td>${c.name}</td>

                <td>
                    ${c.parent ? c.parent.name : "-"}
                </td>

                <td>

                    <button onclick="editCategory(${c.id},'${c.name}')">
                        <i class="fa fa-pen"></i>
                    </button>

                    <button onclick="deleteCategory(${c.id})">
                        <i class="fa fa-trash"></i>
                    </button>

                </td>

            </tr>
        `);

    });

}



function showForm() {

    document.getElementById("categoryForm").style.display = "block";

}




async function saveCategory() {

    const name = document.getElementById("name").value;
    const parentId = document.getElementById("parent").value;

    const body = {
        name: name,
        parentId: parentId || null
    };

    if (editingId) {

        await fetch(API_ADMIN + "/" + editingId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });

        editingId = null;

    } else {

        await fetch(API_ADMIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });

    }

    document.getElementById("name").value = "";
    document.getElementById("parent").value = "";

    loadAdminCategories();

}



function editCategory(id, name) {

    editingId = id;

    document.getElementById("categoryForm").style.display = "block";

    document.getElementById("name").value = name;

}



async function deleteCategory(id) {

    if (!confirm("Xóa danh mục này?")) return;

    await fetch(API_ADMIN + "/" + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token
        }
    });

    loadAdminCategories();

}

loadAdminCategories();