const URL_API = "http://localhost:3000/api";

request();
/*
 * #script.js / function request()
 * Envoie une requet ver le serveur et puis crée les articles avec la reponse .
 */
function request() {
    fetch(URL_API+'/products')
    .then(response  => response.json().then((data) => {
        for (const item of data) {
            createItem(item.name, item.imageUrl, item._id, item.colors, item.description, item.altTxt)
        }
    })).catch((err) => arror());
}

/**
 * Crée une vignette pour chaque item avec les informations recupée du coté de l'api
 * @param { String } name 
 * @param { String } image
 * @param { String } id 
 * @param { String } description 
 * @param { String } altTxt 
 */
function createItem(name, image, id, description, altTxt) {
    // création de l'article
    const article = `
        <article>
            <img src="${image}" alt="${altTxt}">
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
        </article>
    `;
    
    // Ajoute de l'article à l'élément de type lien
    const a = document.createElement("a");
    a.setAttribute("href", `./product.html?id=${id}`);
    a.innerHTML = article;

    //Imbrication des liens dans items
    const items = document.getElementById("items");
    items.appendChild(a);
}
/**
 * error()
 * affiche un message si l'api renvoie une erreur
 */
function error() {
    // création de l'article
    const article = document.createElement("article");
    
    // création du message de l'article
    const message = `
        <p class="productDescription" style="padding-bottom: 25px" >
            Aucun article disponible.<br>
            Merci de revenir ultérieurement.
        </p>
    `;

    // Ajouete le message dans l'article
    article.innerHTML = message;

    // Imbrication de l'article dans items
    const items = document.getElementById("items");
    items.appendChild(article);
}