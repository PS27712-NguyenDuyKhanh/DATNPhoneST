
        const API = "http://localhost:8081/api/admin/products/";
        const CATEGORY_API = "http://localhost:8081/api/categories";

        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        let variantIndex = 0;
        let editor;


        /* CKEDITOR */

        ClassicEditor
            .create(document.querySelector("#description"))
            .then(e => {
                editor = e;
            })
            .catch(error => {
                console.error(error);
            });


        /* LOAD CATEGORY */

        async function loadCategories() {

            const res = await fetch(CATEGORY_API);
            const data = await res.json();

            const select = document.getElementById("categoryId");

            data.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            });

        }

        loadCategories();


        /* UPLOAD IMAGE */

        async function uploadImage(file) {

            const formData = new FormData();
            formData.append("file", file);

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8081/api/file/upload", {

                method: "POST",

                headers: {
                    "Authorization": "Bearer " + token
                },

                body: formData

            });

            return await res.text();

        }


        /* ADD VARIANT */

        function addVariant() {

            const container = document.getElementById("variantContainer");

            document.querySelectorAll(".variant-body").forEach(v => {
                v.style.display = "none";
            });

            variantIndex++;

            const html = `
<div class="variant-card">

<div class="variant-header" onclick="toggleVariant(${variantIndex})">
Biến thể ${variantIndex}
</div>

<div class="variant-body" id="variantBody${variantIndex}">

<input placeholder="Màu sắc" id="color${variantIndex}">
<input placeholder="Giá bán" id="price${variantIndex}">
<input placeholder="Giá khuyến mãi" id="salePrice${variantIndex}">
<input type="datetime-local" id="saleStart${variantIndex}">
<input type="datetime-local" id="saleEnd${variantIndex}">
<input placeholder="Tồn kho" id="stock${variantIndex}">
<input type="file" id="image${variantIndex}">

</div>

</div>
`;

            container.insertAdjacentHTML("beforeend", html);

        }


        /* TOGGLE VARIANT */

        function toggleVariant(index) {

            const body = document.getElementById("variantBody" + index);

            if (body.style.display === "none") {
                body.style.display = "block";
            } else {
                body.style.display = "none";
            }

        }


        /* GET VARIANTS */

        async function getVariants() {

            let variants = [];

            for (let i = 1; i <= variantIndex; i++) {

                const color = document.getElementById("color" + i)?.value;
                if (!color) continue;

                const file = document.getElementById("image" + i)?.files[0];

                let imageUrl = "";

                if (file) {
                    imageUrl = await uploadImage(file);
                }

                variants.push({

                    color: color,

                    price: Number(document.getElementById("price" + i).value),

                    salePrice: Number(document.getElementById("salePrice" + i).value),

                    saleStart: document.getElementById("saleStart" + i).value,

                    saleEnd: document.getElementById("saleEnd" + i).value,

                    stock: Number(document.getElementById("stock" + i).value),

                    images: [
                        {
                            imageUrl: imageUrl
                        }
                    ]

                });

            }

            return variants;

        }


        /* LOAD PRODUCT */

        async function loadProduct() {

            const token = localStorage.getItem("token");

            const res = await fetch(API + productId, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const p = await res.json();

            document.getElementById("name").value = p.name;
            document.getElementById("sku").value = p.sku;
            document.getElementById("os").value = p.os;

            editor.setData(p.description || "");

            document.getElementById("categoryId").value = p.categoryId;


            /* specification */

            if (p.specification) {

                const s = p.specification;

                document.getElementById("cpu").value = s.cpu;
                document.getElementById("ram").value = s.ram;
                document.getElementById("rom").value = s.rom;
                document.getElementById("gpu").value = s.gpu;
                document.getElementById("camera").value = s.camera;
                document.getElementById("battery").value = s.battery;
                document.getElementById("screen").value = s.screen;

            }


            /* variants */

            const variants = p.variants || [];

            variants.forEach(v => {

                addVariant();

                document.getElementById("color" + variantIndex).value = v.color;
                document.getElementById("price" + variantIndex).value = v.price;
                document.getElementById("salePrice" + variantIndex).value = v.salePrice;
                document.getElementById("saleStart" + variantIndex).value = v.saleStart;
                document.getElementById("saleEnd" + variantIndex).value = v.saleEnd;
                document.getElementById("stock" + variantIndex).value = v.stock;

            });

        }

        setTimeout(loadProduct, 500);


        /* UPDATE PRODUCT */

        async function updateProduct() {

            const token = localStorage.getItem("token");

            const variants = await getVariants();

            const data = {

                name: document.getElementById("name").value,

                sku: document.getElementById("sku").value,

                os: document.getElementById("os").value,

                description: editor.getData(),

                categoryId: Number(document.getElementById("categoryId").value),

                specification: {

                    cpu: document.getElementById("cpu").value,
                    ram: document.getElementById("ram").value,
                    rom: document.getElementById("rom").value,
                    gpu: document.getElementById("gpu").value,
                    camera: document.getElementById("camera").value,
                    battery: document.getElementById("battery").value,
                    screen: document.getElementById("screen").value

                },

                variants: variants

            };

            await fetch(API + productId, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify(data)

            });

            alert("Cập nhật sản phẩm thành công");

            window.location.href = "product.html";

        }