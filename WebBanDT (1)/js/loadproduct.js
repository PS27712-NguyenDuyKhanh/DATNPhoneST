const API_PRODUCT = "http://localhost:8081/api/products";

async function loadProducts(){

    const res = await fetch(API_PRODUCT);
    const products = await res.json();

    const list = document.getElementById("productList");

    list.innerHTML = "";

    products.forEach(p => {

        let image = "";

        if(p.images && p.images.length > 0){
            image = p.images[0].imageUrl;
        }

        list.innerHTML += `
            <div class="product-card">

                <img src="${image}">

                <h4>${p.name}</h4>

                <p class="price">${p.price} ₫</p>

                <a href="product-detail.html?id=${p.id}" class="btn-main">
                    Xem chi tiết
                </a>

            </div>
        `;

    });

}

loadProducts();