let name, price, imageUrl, description, colors, altTxt;

// récupération de l' ID du produit dans l'url
const id = new URLSearchParams(window.location.search).get('id');
const selectColors = document.getElementById("colors");



/**
 * On récupère l'ID dans l'url et on envoie la requete à 
 * l'API coté back pour récupérer les infos de l'article
 */
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json()
    .then((data) => {
        name = data.name
        price = data.price
        imageUrl = data.imageUrl
        description = data.description
        colors = data.colors
        altTxt = data.altTxt
        item()
    }))
    .catch(() => error());


/**
 * parms des valeur recupérer par l'API
 * 
 * 
 * @param { String } name 
 * @param { Number } price 
 * @param { String } imageUrl 
 * @param { String } description 
 * @param { Array } colors 
 * @param { String } altTxt 
 * 
 */
function item () {
    // titre de la page
    document.title = name

    // creation de l'ensemble des élement de l'article
    document.querySelector(".item__img").innerHTML = `<img src="${imageUrl}" alt="${altTxt}">`
    document.getElementById("title").innerText = name
    document.getElementById("description").innerText = description
    document.getElementById("price").innerText = price
    for (const color of colors) {
        const option = document.createElement("option")
        option.setAttribute("value", color)
        option.innerText = color
        selectColors.appendChild(option)
    }
 
}

const addToCart = document.getElementById("addToCart")
addToCart.addEventListener('click', () => {
    const color = document.getElementById("colors").value
    const itemQuantity = document.getElementById("quantity").value

    // vérification de la quantité de produit
    if( itemQuantity < 1  || itemQuantity > 100  ) {
        alert("Merci de choisir un numbre d'article compris entre 1 et 100")
    }
    // vérification du couleur
    else if(color.value == ""){
        alert("Merci de choisir une couleur")
    }
    else if(colors.indexOf(selectColors.value) == -1){
        alert("Cette couleur ne coresspond pas")
    }else{
        const newIdSpec = id + selectColors.value
        const product = {
            altTxtItem: altTxt,
            colorItem: selectColors.value,
            idItem: id,
            idSpec: newIdSpec,
            imageUrlItem: imageUrl,
            nameItem: name,
            priceItem: price,
            qtity: itemQuantity
        };
        let products = JSON.parse(localStorage.getItem("products"));
        
        if (products){
            productIndex = products.findIndex( item => item.idSpec == newIdSpec )
            if(productIndex != -1){
                const newQtity =  Number(products[productIndex].qtity ) + Number(itemQuantity) 
                if(newQtity <= 100){
                    product.qtity =  newQtity
                }else{
                    product.qtity =  100
                }
                products.splice(productIndex, 1, product);
            }else{
                products.push(product);
            }
        }else{
          products = []
          products.push(product);
        }
        localStorage.setItem("products", JSON.stringify(products));

        if(itemQuantity>1){
            alert('Vos produits sont dans votre panier')
        }else{
            alert('Votre produit est dans votre panier')
        }

    }
})


/**
 * message d'erreur
 */
function error() {
    alert("error fatal: request")
}