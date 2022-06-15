const main = document.querySelector('main')
container = document.querySelector('main .limitedWidthBlock'),
titles = document.querySelector('.titles'),
items = document.getElementById("items"),
loaderSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="translate(20 50)">
            <circle cx="0" cy="0" r="6" fill="#e15b64">
            <animateTransform attributeName="transform" type="scale" begin="-0.375s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
            </circle>
        </g>
        <g transform="translate(40 50)">
            <circle cx="0" cy="0" r="6" fill="#f8b26a">
            <animateTransform attributeName="transform" type="scale" begin="-0.25s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
            </circle>
        </g>
        <g transform="translate(60 50)">
            <circle cx="0" cy="0" r="6" fill="#abbd81">
            <animateTransform attributeName="transform" type="scale" begin="-0.125s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
            </circle>
        </g>
        <g transform="translate(80 50)">
            <circle cx="0" cy="0" r="6" fill="#81a3bd">
            <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
            </circle>
        </g>
    </svg>
`;

//Disaffichage le block .limitedWidthBlock dans main
container.style.display= 'none';

// création du message de la section
const message = document.createElement("div");
message.className ='item__message';
message.innerHTML = loaderSVG;
message.style = `
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    min-height: 300px;
`;
main.appendChild(message);

/* 
 * Envoie une requet ver le serveur et puis crée les articles avec la reponse .
 */
fetch('http://localhost:3000/api/products')
    .then(response  => response.json()
    .then(data => {
        // test n°2 |console.log(data);

        // création des articles
        for (const item of data) {
            createItem(item)
        }
        
        // Disafficher le message puis afficher l'article
        const message = document.querySelector('.item__message');
        message.style.display = 'none';

        //Affichage le block .limitedWidthBlock dans main
        container.style.display= 'block';

    }))
    .catch(err => error(err));

/**
 * Crée un article avec des liens unique pour chaque item avec les informations recupée du coté de l'api
 * @param { String } name 
 * @param { String } imageUrl
 * @param { String } _id 
 * @param { String } description 
 * @param { String } altTxt 
 */
createItem = ({name, imageUrl, _id, description, altTxt}) => {
    // création de l'article
    const article = `
        <a href="./product.html?id=${_id}">
            <article>
                <img src="${imageUrl}" alt="${altTxt}">
                <h3 class="productName">${name}</h3>
                <p class="productDescription">${description}</p>
            </article>
        </a>
    `;
    
    //Imbrication des article dans items
    items.innerHTML += article;
}

/**
 * affiche un message si l'api renvoie une erreur
 * 
 * @param {any} err
 */
error =(err) => {
    // test n°4 | console.log(err)
    
    // création du message 
    const message = document.querySelector('.item__message');
    message.innerHTML = 'Aucun article disponible.<br>Merci de revenir ultérieurement.';
}