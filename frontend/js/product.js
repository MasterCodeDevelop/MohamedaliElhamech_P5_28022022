// récupération de l' ID du produit dans l'url
const id = new URLSearchParams(window.location.search).get('id');
// test n°1 | console.log(id);

const item = document.querySelector(".item"),
    article = document.querySelector("article"),
    selectColors = document.getElementById("colors"),
    quantity = document.getElementById('quantity'),
    addToCart = document.getElementById("addToCart"),
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
// disafficher l'article
article.style.display = 'none';

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
item.appendChild(message);

//l'API coté back pour récupérer les infos de l'article
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
        // test n°2 | console.log(data);

        // mettre à jour l'article
        updateItem(data);

        // Disafficher le message .item__message puis afficher l'article
        const message = document.querySelector('.item__message');
        message.style.display = 'none';
        article.style.display = 'flex';
    })
    .catch(err => error(err));
/**
 * Met à jours les donées recupéré par l'API
 * 
 * @param { String } name
 * @param { Number } price
 * @param { String } imageUrl
 * @param { String } description
 * @param { Object } colors
 * @param { String } altTxt
 * 
 */
updateItem = ({ name, price, imageUrl, description, colors, altTxt }) => {

    // titre de la page
    document.title = name
    
    // creation de l'ensemble des élement de l'article
    document.querySelector(".item__img").innerHTML = `<img src="${imageUrl}" alt="${altTxt}">`
    document.getElementById("title").innerText = name
    document.getElementById("description").innerText = description
    document.getElementById("price").innerText = price
    for (const color of colors) {
        selectColors.innerHTML += `<option value="${color}">${color}</option>`;
    }
    addToCart.addEventListener('click', () => toCart(colors))
}

toCart = (colors) => {
    const colorItem = selectColors.value,
    qtity = quantity.value;

    // vérification si tous les champs sont bien remplis
    if ( colorItem == '' || qtity == 0 ) {
        alert("Merci de remplir tous les champs");
    }
    // vérification de la quantité de produit
    else if( qtity < 1  || qtity > 100  ) {
        alert("Merci de choisir un numbre d'article compris entre 1 et 100");
    }
    // vérification du couleur
    else if(colors.indexOf(colorItem) == -1){
        alert("Cette couleur ne coresspond pas");
    } else {
        // ajoute l'article dans le localStorage
        setLocalStorage();
    }
}

/**
 * Ajoute les informations choisie dans le localStorage
 */
setLocalStorage = () => {
    const newIdSpec = id + selectColors.value,
    qtity = quantity.value,
    product = {
        idItem: id,
        colorItem: selectColors.value,
        qtity: qtity
    };

    let localStorageProducts = JSON.parse(localStorage.getItem("products"));

    // si array products est dans le localStorage
    if (localStorageProducts){
        const productIndex = localStorageProducts.findIndex( item => item.idItem+item.colorItem == newIdSpec );
        
        // si item existe déja dans le localStorage
        if(productIndex != -1){
            const newQtity =  Number(localStorageProducts[productIndex].qtity ) + Number(quantity.value);

            // ne pas dépasser la quantité maximal
            if(newQtity <= 100){
                product.qtity =  newQtity;
            }else{
                product.qtity =  100;
            }
            localStorageProducts.splice(productIndex, 1, product);

        // si item n'existe pas encore dans le localStorage
        }else{
            localStorageProducts.push(product);
        }
    } else {
        // si non crée array product et ajouter à localStorageProducts
        localStorageProducts = [product];
    }
    // ajoute l'array localStorageProducts dans localStorage
    localStorage.setItem("products", JSON.stringify(localStorageProducts));

    // test n°9 | console.log(JSON.parse(localStorage.getItem("products")));

    // alert succées
    if(qtity > 1){
        alert('Vos produits sont dans votre panier');
    }else{
        alert('Votre produit est dans votre panier');
    }
    
    // remettre tous les selecteurs par default
    selectColors.selectedIndex = 0;
    quantity.value = '0';
}

/**
 * En cas d'échec de la requète, remplace l'article par un message d'erreur
 */
error = (err) => {
    // test n° 6 | console.log(err)
    const message = document.querySelector('.item__message');
    message.innerHTML='Oups !<br> Quelque chose a mal tourné.'
}