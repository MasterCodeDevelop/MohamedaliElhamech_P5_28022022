// récupération de l' ID du produit dans l'url
const id = new URLSearchParams(window.location.search).get('id');
// test n°4 | console.log(id);

const 
    item = document.querySelector(".item"),
    article = document.querySelector("article"),
    selectColors = document.getElementById("colors"),
    quantity = document.getElementById('quantity'),
    addToCart = document.getElementById("addToCart");

// disafficher l'article
article.style.display = 'none';

// création du message de la section
const message = document.createElement("p");
message.className ='item__message';
message.innerHTML = "Rechargement...";
message.style.textAlign = "center";
message.style.color = "#fff";
item.appendChild(message);


/**
 * On récupère l'ID dans l'url et on envoie la requete à 
 * l'API coté back pour récupérer les infos de l'article
 */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
        // test n°7 | console.log(data);

        // mettre à jour l'article
        updateItem(data);

        // Disafficher le message puis afficher l'article
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
        alert("Merci de remplir tous les champs")
    }
    // vérification de la quantité de produit
    else if( qtity < 1  || qtity > 100  ) {
        alert("Merci de choisir un numbre d'article compris entre 1 et 100")
    }
    // vérification du couleur
    else if(colors.indexOf(colorItem) == -1){
        alert("Cette couleur ne coresspond pas")
    } else {
        // ajoute l'article dans le localStorage
        setLocalStorage();

        // alert succées
        if(qtity > 1){
            alert('Vos produits sont dans votre panier')
        }else{
            alert('Votre produit est dans votre panier')
        }
        
        // remettre tous les selecteurs par default
        selectColors.selectedIndex = 0;
        quantity.value = '0';
    }
}

/**
 * Ajoute les informations choisie dans le localStorage
 */
setLocalStorage = () => {
    const newIdSpec = id + selectColors.value,
    product = {
        idItem: id,
        colorItem: selectColors.value,
        qtity: quantity.value
    };

    let localStorageProducts = JSON.parse(localStorage.getItem("products"));
    //test n°8 | console.log(localStorageProducts)

    // si array products est dans le localStorage
    if (localStorageProducts){
        const productIndex = localStorageProducts.findIndex( item => item.idItem+item.colorItem == newIdSpec )
        // si item existe déja dans le localStorage
        if(productIndex != -1){
            const newQtity =  Number(localStorageProducts[productIndex].qtity ) + Number(quantity.value) 

            // ne pas dépasser la quantité maximal
            if(newQtity <= 100){
                product.qtity =  newQtity
            }else{
                product.qtity =  100
            }
            localStorageProducts.splice(productIndex, 1, product);
        }else{
            localStorageProducts.push(product);
        }
    } else {
        // si non crée array product et ajouter à localStorageProducts
        localStorageProducts = [product]
    }
    // ajoute l'array localStorageProducts dans localStorage
    localStorage.setItem("products", JSON.stringify(localStorageProducts));
}

/**
 * En cas d'échec de la requète, remplace l'article par un message d'erreur
 */
error = (err) => {
    // test n°  | console.log(err)
    const message = document.querySelector('.item__message');
    message.innerHTML='Oups !<br> Quelque chose a mal tourné.'
}