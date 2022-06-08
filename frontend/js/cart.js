var products = [],
localStorageProducts = JSON.parse(localStorage.getItem("products"));
//console.log(localStorageProducts)
const items = document.getElementById("cart__items");
const section = document.getElementById("cart__items");

/*
 * Envoie une requet ver le serveur pour récupérer les informations sur les produits .
 */
if ( localStorageProducts && localStorageProducts.length != 0 ) {
    fetch('http://localhost:3000/api/products')
        .then(response  => response.json()
        .then(data => {
            // console.log(data);
            products = data;

            const productsListOrdered = localStorageProducts.sort((a, b) => {
                if (a.nameItem < b.nameItem) {return -1;}
                if (a.nameItem > b.nameItem) {return 1};
                return 0;
            });
            for (const item of productsListOrdered) {
                const {idItem, colorItem, qtity} = item;
                createItem({idItem, colorItem, qtity})
            }
            updateQuantityAndPrice();
            
        }))
        .catch(err => console.log(err));
} else {
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


/**
 * Créer un nouvelle article dans la section #cart__items
 * 
 * @param { String } idItem 
 * @param { String } colorItem
 * @param { String } qtity
 * 
 */
function createItem({idItem, colorItem, qtity}) {
    index = products.findIndex( item => item._id  == idItem );
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

/**
 * Mets à jour la quantité ainsi que le prix total
 */
function updateQuantityAndPrice() { 
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

function removeItem (e){
    const {id, color} = e.target.closest("article").dataset,
    productIndex = localStorageProducts.findIndex( item => item.idItem + item.colorItem == id+color );

    localStorageProducts.splice(productIndex, 1)
    localStorage.setItem("products", JSON.stringify(localStorageProducts))
    window.location.reload()
}



// order
const 
    orderButton = document.getElementById("order"),
    form = document.querySelector('.cart__order__form');

for (let i = 0; i < form.children.length-1; i++) {
    const input = form.children[i];
    input.onchange = (e) => {
        validate(e);
    }
    
}
const errorMessage = (name) => {
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
        return "error"
    }
}

const regex = (name) => {
    if(name == 'firstName' || name =='lastName' || name == 'city' ) {
        return /^[^@&"()!_$*€£`+=\/;?#\d]+$/;
    } else if(name == 'address') {
        return /(?!^\d+$)^[^@&"()!_$*€£`+=\/;?#]+$/;
    } else if (name == 'email') {
        return /^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/i;
    }
}
function validate(e) {
    const { name, value, style } = e.target,
    errorMsg = document.getElementById(name+"ErrorMsg");

    if (regex(name).test(value) == true ) {
        style.border = "0";
        errorMsg.innerText = "";
        return 0;
    } else {
        style.border = "2px solid red"
        errorMsg.innerText = errorMessage(name);
        return 1;
    }
}
orderButton.addEventListener('click', ()=>{
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
        //alert("Veuillez remplir tous les champs")
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


function requestOrder(formOrder) {
    // Données à envoyer
    const localStorageProductsID = []
    for (const item of localStorageProducts) {
        localStorageProductsID.push(item.idItem)
    }

    const order = {
        contact: formOrder,
        products: localStorageProductsID
    };
    console.log(order)
    // En-tête de la requête
    const entete = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {"Content-Type": "application/json"},
    };

    fetch("http://localhost:3000/api/products/order", entete)
        .then((response) => {
            // On vérifie qu'on reçoit bien un status HTTP 201 c'est à dire que la requête a réussi et qu'une ressource a été créée en conséquence
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