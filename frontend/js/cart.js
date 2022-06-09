var products = [],
localStorageProducts = JSON.parse(localStorage.getItem("products"));
//console.log(localStorageProducts)

const items = document.getElementById("cart__items"),
orderButton = document.getElementById("order"),
form = document.querySelector('.cart__order__form');

/*
 * Envoie une requet ver le serveur pour récupérer les informations sur les produits .
 */
if ( localStorageProducts && localStorageProducts.length != 0 ) {
    fetch('http://localhost:3000/api/products')
        .then(response  => response.json()
        .then(data => {
            // console.log(data);
            products = data;
            
            // mets en ordre le localStorage
            const productsListOrdered = localStorageProducts.sort((a, b) => {
                if (a.nameItem < b.nameItem) {return -1;}
                if (a.nameItem > b.nameItem) {return 1};
                return 0;
            });
            // console.log(productsListOrdered);

            // créer chaque article de productsListOrdered avec les informations récupérer du coté de l'API.
            for (const item of productsListOrdered) {
                const {idItem, colorItem, qtity} = item;
                createItem({idItem, colorItem, qtity})
            }
            updateQuantityAndPrice();
            
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
        article.innerHTML = `
            <article class="cart__item" data-id="${idItem}" data-color="${colorItem}">
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
            </article>
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

    // On écoute le changement de chaque élément input
    onChangeQtity = (e) => {
        const newQtity = e.target.value,
        {id, color} = e.target.closest("article").dataset,
        idSpec = id+color,
        productIndex = localStorageProducts.findIndex( item => item.idItem + item.colorItem == idSpec );

        // si la quantité de produit change et dans les normes alors ça met à jour les changement
        if(newQtity != localStorageProducts[productIndex].qtity && (0 < newQtity && newQtity <= 100 )){
            localStorageProducts[productIndex].qtity = newQtity
            localStorage.setItem("products", JSON.stringify(localStorageProducts));
            updateQuantityAndPrice()
        }
        // si non on supprime l'article
        else {
            removeItem(e)
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
    window.location.reload()
}



// Pour chaque changement input dans le formulaire validate vérifie s'il y a des erreurs
for (let i = 0; i < form.children.length-1; i++) {
    const input = form.children[i];
    input.onchange = e => validate(e);
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
    // test n°  | console.log(order)

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

function error(err) {
    //test n° | console.log(err)

    // creation de message
    const message = `
        <p style="text-align: center; margin-bottom: 50px;" >
            Votre panier est vide pour le moment
        </p>
    `
    //imbrication de message dans la section cart__items
    items.innerHTML += message;

    //ne pas afficher les blocs .cart__price et .cart__order
    const cartPrice = document.querySelector('.cart__price'),
    cartOrder = document.querySelector('.cart__order');

    cartPrice.style.display='none';
    cartOrder.style.display='none';
}