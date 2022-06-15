var products = [],
localStorageProducts = JSON.parse(localStorage.getItem("products"));
// test n° 1 | console.log(localStorageProducts)

const container = document.getElementById('limitedWidthBlock'),
cartAndFormContainer = document.getElementById('cartAndFormContainer'),
items = document.getElementById("cart__items"),
orderButton = document.getElementById("order"),
form = document.querySelector('.cart__order__form'),
cartPrice = document.querySelector('.cart__price'),
cartOrder = document.querySelector('.cart__order'),
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

// Disafficher le bloc #cartAndFormContainer
cartAndFormContainer.style.display = 'none';

// Création du message de la section
const message = document.createElement("div");
message.className ='item__message';
message.innerHTML = loaderSVG;
message.style = `
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    padding-top: 90px;
    height: 300px;
`;
message.style.textAlign = "center";
message.style.color = "#fff";
limitedWidthBlock.appendChild(message);


/*
 * Envoie une requet ver le serveur pour récupérer les informations sur les produits .
 */
if ( localStorageProducts && localStorageProducts.length != 0 ) {
    fetch('http://localhost:3000/api/products')
        .then(response  => response.json()
        .then(data => {
            // test n° 3 | console.log(data);
            products = data;
            
            // mets en ordre le localStorage
            const productsListOrdered = localStorageProducts.sort((a, b) => {
                if (a.nameItem < b.nameItem) {return -1;}
                if (a.nameItem > b.nameItem) {return 1};
                return 0;
            });
            //test n° 4 | console.log(productsListOrdered);

            // créer chaque article de productsListOrdered avec les informations récupérer du coté de l'API.
            for (const item of productsListOrdered) {
                const {idItem, colorItem, qtity} = item;
                createItem({idItem, colorItem, qtity})
            }
            
            updateQuantityAndPrice();
            
            // Disafficher le message puis afficher l'article
            const message = document.querySelector('.item__message');
            message.style.display = 'none';

            //afficher le bloc #limitedWidthBlock
            cartAndFormContainer.style.display='block';
            
        }))
        .catch(err => error(err));
} else {
    error();
}


/**
 * Créer un nouvelle article dans la section #cart__items
 * 
 * @param { String } idItem 
 * @param { String } colorItem
 * @param { String } qtity
 * 
 */
createItem = ({idItem, colorItem, qtity}) => {
    index = products.findIndex( item => item._id  == idItem );

    // Si l'article existe dans products alors on le créer
    if (index != -1) {
        const { name, price, imageUrl, description, altTxt } = products[index];

        // créer l'article
        const article = document.createElement("article");
        article.className = "cart__item";
        article.dataset.id =  idItem;
        article.dataset.color =  colorItem;
        article.innerHTML = `
            <div class="cart__item__img">
                <img src="${imageUrl}" alt="${altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${name}</h2>
                    <p>${colorItem}</p>
                    <p>${price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qtity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        `;

        // si la quantité de l'article change 
        const itemQuantity = article.querySelector('.itemQuantity');
        itemQuantity.addEventListener('change', onChangeQtity  );
        
        // si on clique sur supprimer
        const deleteItem = article.querySelector('.deleteItem');
        deleteItem.addEventListener('click', removeItem);

        // Imbrication de l'article dans la section
        items.appendChild(article);
    }
}

/**
 * Mets à jour la quantité ainsi que le prix total
 */
updateQuantityAndPrice = () => { 
    let 
        totalQuantity = 0,
        totalPrice = 0;

    if (localStorageProducts && products) {
        for (const item of localStorageProducts) {
            const 
                {idItem, colorItem, qtity} = item,
                index = products.findIndex( item => item._id  == idItem ),
                price = products[index].price;

            totalPrice += Number(qtity) * Number(price);
            totalQuantity += Number(qtity);
        }
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity
    document.getElementById("totalPrice").innerHTML = totalPrice
}

function error(err) {
    //test n°8 | console.log(err)

    // création et imbrication de message dans la section cart__items
    const message = document.querySelector('.item__message');
    message.innerHTML = `
        <p style="text-align: center; margin-bottom: 50px;" >
            Votre panier est vide pour le moment
        </p>
    `;    
}



// On écoute le changement de chaque élément input
onChangeQtity = (e) => {
    const newQtity = e.target.value,
    {id, color} = e.target.closest("article").dataset,
    idSpec = id+color,
    productIndex = localStorageProducts.findIndex( item => item.idItem + item.colorItem == idSpec ),
    qtity = localStorageProducts[productIndex].qtity;

    // si la quantité de produit change et dans les normes alors ça met à jour les changement
    if(newQtity != qtity && (0 < newQtity && newQtity <= 100 )){
        localStorageProducts[productIndex].qtity = newQtity
        localStorage.setItem("products", JSON.stringify(localStorageProducts));
        updateQuantityAndPrice()
    }
    // si non on alert() un message d'erreur et remet la quatité de l'article à son initial
    else {
        e.target.value = qtity;
        alert("Merci de choisir un numbre d'article compris entre 1 et 100");
    }
}

/**
 * si on clique sur le boutton supprimer celà éfface l'article
 * 
 * @param {any} e 
 */
removeItem = (e) => {
    const {id, color} = e.target.closest("article").dataset,
    productIndex = localStorageProducts.findIndex( item => item.idItem + item.colorItem == id+color );

    localStorageProducts.splice(productIndex, 1)
    localStorage.setItem("products", JSON.stringify(localStorageProducts))
    e.target.closest("article").remove()
    // test n°10 | console.log(JSON.parse(localStorage.getItem("products")));

    updateCart();
}

// Si un article est suprimer ça met à jour le panier
updateCart = () => {
    if(items.children.length == 0) {
        error();

        // Disafficher le bloc #limitedWidthBlock
        cartAndFormContainer.style.display='none';

        // Afficher  le message puis afficher l'article
        const message = document.querySelector('.item__message');
        message.style.display = 'flex';
    } else {
        updateQuantityAndPrice();
    }
}

// Pour chaque changement input dans le formulaire validate vérifie s'il y a des erreurs
for (let i = 0; i < form.children.length-1; i++) {
    const input = form.children[i];
    input.onchange = e => validate(e);
}

/**
 * Valider l'input, s'il y a une erreur l'afficher
 * 
 * @param {any} e 
 */
validate = (e) => {
    const { name, value, style } = e.target,
    errorMsg = document.getElementById(name+"ErrorMsg");

    if (regex(name, value)) {
        style.border = "0";
        errorMsg.innerText = "";
    } else {
        style.border = "2px solid red"
        errorMsg.innerText = errorMessage(name);
    }
}

/**
 * Cette fonction retourne le message d'erreur en function du nom de chaque input du formulaire
 * 
 * @param { String } name 
 * @returns { String }
 */
errorMessage = (name) => {
    if (name == 'firstName') {
        return "Veuillez saisir votre prénom !";
    } else if (name == 'lastName') {
        return "Veuillez saisir votre nom !";
    } else if (name == 'address') {
        return "Veuillez saisir votre adresse postal !";
    } else if (name == 'city') {
        return "Veuillez saisir le nom de votre ville !";
    } else if (name == 'email') {
        return "Veuillez saisir votre adresse email !";
    } else {
        return "erreur"
    }
}

/**
 * Regex est utilisé pour étudier les correspondances de texte (value) avec un motif (pattern) donné.
 * 
 * @param {String} value
 * @param {String} name 
 * @returns {Boolean}
 */
regex = (name, value) => {
    let pattern = /^[^@&"()!_$*€£`+=\/;?#\d]+$/;
    if(name == 'address') {
        pattern = /(?!^\d+$)^[^@&"()!_$*€£`+=\/;?#]+$/;
    } else if (name == 'email') {
        pattern = /^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/i;
    }
    return pattern.test(value);
}


// Lorsque on clique sur commander
orderButton.addEventListener('click', () => {

    //verifie chaque input dans le formulaire et afficher l'erreur s'il y'en a
    let error = 0;
    for (let i = 0; i < form.length-1; i++) {
        const e = form[i],
        errorMsg = document.getElementById(e.name+"ErrorMsg");
        if(e.value == '') {
            e.style.border = "2px solid red";
            errorMsg.innerText = errorMessage(e.name);
            error += 1;
        }
    }
    
    // s'il n'y a pas d'erreur alors on envoie la requette à l'API
    if (error == 0) {
        const formOrder = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        }
        requestOrder(formOrder)
    }
})

/**
 * fait la demmande de commande à l'API
 * 
 * @param {Object} formOrder
 */
requestOrder = (formOrder) => {
    const localStorageProductsID = []
    for (const item of localStorageProducts) {
        localStorageProductsID.push(item.idItem)
    }

    // Données à envoyer
    const order = {
        contact: formOrder,
        products: localStorageProductsID
    };
    // test n° 18 | console.log(order)

    // En-tête de la requête
    const entete = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {"Content-Type": "application/json"},
    };

    fetch("http://localhost:3000/api/products/order", entete)
        .then((response) => {
            /**
             * On vérifie qu'on reçoit bien un status HTTP 201
             * c'est à dire que la requête a réussi et qu'une ressource a été créée en conséquence
             */
            if (response.status == 201) {
                return response.json();
            }
            else {
                alert("La validation de l'achat a échoué. Veuillez essayer de nouveau ultérieurement");
                console.error("Echec de la requête POST, status : " + response.status);
            }
        })
        .then((data) => {
            localStorage.clear();
            document.location.href = `confirmation.html?id=${data.orderId}`;
        })
        .catch(
            (error) => {
              console.log(error);
            }
        );
}