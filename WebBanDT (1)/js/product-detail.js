const API = "http://localhost:8081/api/products/";

async function loadProduct() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    const res = await fetch(API + id);
    const p = await res.json();

    document.getElementById("name").innerText = p.name || "";
    document.getElementById("description").innerText = p.description || "";

    const image = document.getElementById("image");
    const price = document.getElementById("price");
    const colors = document.getElementById("colors");
    const specs = document.getElementById("specs");

    const variants = p.variants || [];

    // thông số
    if(p.specification){

        const s = p.specification;

        specs.innerHTML = `
            <li><b>CPU:</b> ${s.cpu || "-"}</li>
            <li><b>RAM:</b> ${s.ram || "-"}</li>
            <li><b>ROM:</b> ${s.rom || "-"}</li>
            <li><b>GPU:</b> ${s.gpu || "-"}</li>
            <li><b>Camera:</b> ${s.camera || "-"}</li>
            <li><b>Pin:</b> ${s.battery || "-"}</li>
            <li><b>Màn hình:</b> ${s.screen || "-"}</li>
        `;
    }

    colors.innerHTML = "";

    variants.forEach((v, index) => {

        const btn = document.createElement("button");
        btn.innerText = v.color;

        btn.onclick = () => {

            const img = v.images?.[0]?.imageUrl || "";
            image.src = "http://localhost:8081" + img;

            const finalPrice = v.salePrice || v.price || 0;
            price.innerText = finalPrice.toLocaleString() + " đ";
        };

        colors.appendChild(btn);

        if(index === 0){
            const img = v.images?.[0]?.imageUrl || "";
            image.src = "http://localhost:8081" + img;

            const finalPrice = v.salePrice || v.price || 0;
            price.innerText = finalPrice.toLocaleString() + " đ";
        }

    });

}

loadProduct();