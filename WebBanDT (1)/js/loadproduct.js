const API_PRODUCT = "http://localhost:8081/api/products";

async function loadProduct(){

    const res = await fetch(API_PRODUCT);

    const data = await res.json();

    // FIX pagination
    const products = data.content || data;

    const list = document.getElementById("productList");

    list.innerHTML = "";

    products.forEach(p => {

        const variants = p.variants || [];

        if(variants.length === 0) return;

        const firstVariant = variants[0];

        const img = firstVariant.images?.[0]?.imageUrl || "";

        const price = Math.min(...variants.map(v => v.price));

        const stock = variants.reduce((sum,v)=>sum+(v.stock||0),0);

        list.innerHTML += `
        <div class="product-card">

            <img src="http://localhost:8081${img}" class="product-img">

            <h3>${p.name}</h3>

            <p class="price">${price.toLocaleString()} đ</p>

            <p class="stock">Còn ${stock} sản phẩm</p>

            <a href="product-detail.html?id=${p.id}" class="btn-main">
                Xem chi tiết
            </a>

        </div>
        `;
    });
}

window.onload = loadProduct;