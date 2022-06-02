/*
 * Envoie une requet ver le serveur et puis crée les articles avec la reponse .
 */
fetch('http://localhost:3000/api/products')
    .then(response  => response.json()
    .then(data => {
        // test n°1 | console.log(data);
        for (const item of data) {
            createItem(item.name, item.imageUrl, item._id, item.colors, item.description, item.altTxt)
        }
    }))
    .catch(err => error());

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
        <a href="./product.html?id=${id}">
            <article>
                <img src="${image}" alt="${altTxt}">
                <h3 class="productName">${name}</h3>
                <p class="productDescription">${description}</p>
            </article>
        </a>
    `;
    
    //Imbrication des article dans items
    const items = document.getElementById("items");
    items.innerHTML += article;
}
/**
 * affiche un message si l'api renvoie une erreur
 */
function error() {
    // création du message 
    const message = `
        <p class="productDescription" style="padding-bottom: 25px" >
            Aucun article disponible.<br>
            Merci de revenir ultérieurement.
        </p>
    `;

    // Imbrication de l'article dans items
    const items = document.getElementById("items");
    items.innerHTML = message;
}