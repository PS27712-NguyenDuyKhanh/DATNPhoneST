const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct(){

    const res = await fetch(`http://localhost:8081/api/products/${id}`);
    const p = await res.json();

    document.getElementById("name").innerText = p.name;
    document.getElementById("price").innerText = p.price + " ₫";
    document.getElementById("description").innerText = p.description;

    if(p.images && p.images.length > 0){
        document.getElementById("image").src = p.images[0].imageUrl;
    }

    const colors = document.getElementById("colors");
    colors.innerHTML = "";

    p.images.forEach(img => {

        colors.innerHTML += `
            <button class="btn btn-outline-dark me-2"
                onclick="changeImage('${img.imageUrl}')">
                ${img.color}
            </button>
        `;

    });

}

function changeImage(url){
    document.getElementById("image").src = url;
}

loadProduct();