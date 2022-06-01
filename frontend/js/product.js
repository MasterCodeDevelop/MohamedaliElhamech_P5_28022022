var name, price, imageUrl, description, colors, altTxt;

// récupération de l' ID du produit dans l'url
const id = new URLSearchParams(window.location.search).get('id'),
      selectColors = document.getElementById("colors");
// test n°4 | console.log(id);


/**
 * On récupère l'ID dans l'url et on envoie la requete à 
 * l'API coté back pour récupérer les infos de l'article
 */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
        // test n°5 | console.log(data);
        name = data.name;
        price = data.price;
        imageUrl = data.imageUrl;
        description = data.description;
        colors = data.colors;
        altTxt = data.altTxt;
        createItem(data);
    })
    .catch(err => error());


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
function createItem () {
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

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener('click', () => {
    const color = document.getElementById("colors").value,
          itemQuantity = document.getElementById("quantity").value

    // vérification si tous les champs sont bien remplis
    if ( color == '' || itemQuantity == 0 ) {
        alert("Merci de remplir tous les champs")
    }
    // vérification de la quantité de produit
    else if( itemQuantity < 1  || itemQuantity > 100  ) {
        alert("Merci de choisir un numbre d'article compris entre 1 et 100")
    }
    // vérification du couleur
    else if(colors.indexOf(selectColors.value) == -1){
        alert("Cette couleur ne coresspond pas")
    } else {
        const newIdSpec = id + selectColors.value,
        product = {
            altTxtItem: altTxt,
            colorItem: selectColors.value,
            idItem: id,
            idSpec: newIdSpec,
            imageUrlItem: imageUrl,
            nameItem: name,
            priceItem: price,
            qtity: itemQuantity
        };
        // test n°8 | console.log(product);

        let products = JSON.parse(localStorage.getItem("products"));
        //test n°8 | console.log(products)
        // si array products est dans le localStorage
        if (products){
            const productIndex = products.findIndex( item => item.idSpec == newIdSpec )
            // si item existe déja dans le localStorage
            if(productIndex != -1){
                const newQtity =  Number(products[productIndex].qtity ) + Number(itemQuantity) 
                // ne pas dépasser la quantité maximal
                if(newQtity <= 100){
                    product.qtity =  newQtity
                }else{
                    product.qtity =  100
                }
                products.splice(productIndex, 1, product);
            }else{
                products.push(product);
            }
        } else {
            // si non crée array product et ajouter dans le localStorage
            products = []
            products.push(product);
        }
        localStorage.setItem("products", JSON.stringify(products));
        
        // alert succées
        if(itemQuantity>1){
            alert('Vos produits sont dans votre panier')
        }else{
            alert('Votre produit est dans votre panier')
        }
    }
})


/**
 * En cas d'échec de la requète, remplace l'article par un message d'erreur
 */
function error() {
    const item = document.querySelector(".item"),
          article = document.querySelector("article");

    // supprimer l'article dans section '.item'
    item.removeChild(article);

    // création du message de l'article
    const message = `
        <p class="productDescription" style="text-align: center; color: black;" >
            Oups !<br>
            Quelque chose a mal tourné.
        </p>
    `;

    // Imbrication du message dans la section
    item.appendChild(message);
}