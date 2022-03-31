let url = "http://localhost:3000/api/products";
request()
function request() {
    fetch(url)
    .then(
        response  => response.json().then((data) => {
            for (const item of data) {
                Item(item.name, item.imageUrl, item._id, item.colors, item.description, item.altTxt)
            }
        })
    )
    .catch((e) => showError());
}
function Item(name, image, id, description, altTxt) {

    // création de l'article en html
    const article = `
        <article>
            <img src="${image}" alt="${altTxt}">
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
        </article>
    `
  
    const a = document.createElement("a");
    a.setAttribute("href", `./product.html?id=${id}`);
    a.innerHTML = article;

    // Ajoueté a dans items
    const items = document.getElementById("items");
    items.appendChild(a);
}
function showError() {
    const article = document.createElement("article");

    const articleChild = `
        <p class="productDescription" style="padding-bottom: 25px" >
            Aucun article disponible.<br>
            Merci de revenir ultérieurement.
        </p>
    `
    article.innerHTML = articleChild;
    
    const items = document.getElementById("items");
    items.appendChild(article);
}