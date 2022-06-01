var products = JSON.parse(localStorage.getItem("products"))
const items = document.getElementById("cart__items");

// S'il y a bien quelques chose dans le localStorage :
if (products && products.length != 0) {
    // mettre les produits en ordres
    const productsListOrdered = products.sort((a, b) => {
        if (a.nameItem < b.nameItem) {return -1;}
        if (a.nameItem > b.nameItem) {return 1};
        return 0;
    });
    for(const product of productsListOrdered){
        // creation et imbrication de l'article
        const articleChilds = `
            <div class="cart__item__img">
                <img src="${product.imageUrlItem}" alt="Photographie de ${product.nameItem}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.nameItem}</h2>
                    <p>${product.colorItem}</p>
                    <p>${product.priceItem} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qtity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        `
        const article = document.createElement("article");
        article.className = "cart__item";
        article.dataset.idSpec = product.idSpec;
        article.innerHTML = articleChilds;
        items.appendChild(article);

        total();
    }
}
// Si le localStorage est vide :
else {
    // creation de message
    const 
        message = document.createElement("p"),
        cartPrice = document.querySelector('.cart__price'),
        cartOrder = document.querySelector('.cart__order');

    message.innerText = "Votre panier est vide pour le moment";
    message.style = `
        text-align: center;
        margin-bottom: 50px;
    `;
    //imbrication de message dans la section cart__items
    items.appendChild(message);

    //supprissions des blocs .cart__price et .cart__order
    cartPrice.remove();
    cartOrder.remove();
}

const inputsQtity = document.querySelectorAll(".itemQuantity");
inputsQtity.forEach((inputQtity) => {
    inputQtity.addEventListener('change', (e) => {
        newQtity = e.target.value
        const idSpec = e.target.closest("article").dataset.idSpec
        console.log(idSpec)
        productIndex = products.findIndex( item => item.idSpec == idSpec )
        if(newQtity != products[productIndex].qtity && (0 <= newQtity && newQtity <= 100 )){
            products[productIndex].qtity = newQtity
            localStorage.setItem("products", JSON.stringify(products));
            total()
        }
    })
})
/**
 * Renvoie l'id du produit stocké dans les data de l'article parent de l'input qui a été modifié
 * @param { Object } e 
 * @returns
 */
    function getId (e) {
    return e.target.closest("article").dataset.id;
}
function total() {
    var totalQuantity = 0
    var totalPrice = 0

    for(const product of products){
        totalQuantity += Number(product.qtity)
        totalPrice += Number(product.qtity) * Number(product.priceItem)
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity
    document.getElementById("totalPrice").innerHTML = totalPrice
}

// deleteItem || Supprimer l'article en cliquant sur supprimer
const item = document.querySelectorAll(".deleteItem")
item.forEach((item) => {
    item.addEventListener('click', (e) => {
        const idSpec = e.target.closest("article").dataset.idSpec
        productIndex = products.findIndex( item => item.idSpec == idSpec )
        const product = products[productIndex]
        if(confirm(`Vous êtes sur le point de suprimer cette article : ${product.nameItem+"  "+product.colorItem}`)){
            products.splice(productIndex, 1)
            localStorage.setItem("products", JSON.stringify(products))
            window.location.reload()
        }
    })

})



firstName = document.getElementById("firstName"),
lastName = document.getElementById("lastName"),
address = document.getElementById("address"),
city = document.getElementById("city"),
email = document.getElementById("email")
formValid = true;

errorfirstName = false

function crctr(field, value) {
    if(field == "address"){
        return /(?!^\d+$)^[^@&"()!_$*€£`+=\/;?#]+$/.test(value)
    }else if (field == "email"){
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value)
    }else{
        return /^[^@&"()!_$*€£`+=\/;?#\d]+$/.test(value)
    }
}

function isValid(field, value, errorMsg, msgVoid, msg){
    if(value == ""){
        errorMsg.innerText = msgVoid
    }else if( ! crctr(field, value) ){
        errorMsg.innerText = msg
    }else{
        errorMsg.innerText = ""
    }
}

// verification prénom
firstName.addEventListener("change", () => {
    const value = firstName.value
    const errorMsg = document.getElementById("firstNameErrorMsg")
    isValid("firstName", value, errorMsg, "Veuillez saisir votre prénom !", "Veuillez saisir un prénom correct !")
})

// verification nom
lastName.addEventListener("change", () => {
    const value = lastName.value
    const errorMsg = document.getElementById("lastNameErrorMsg")
    isValid("lastNamme", value, errorMsg, "Veuillez saisir votre nom !", "Veuillez saisir un nom correct !")
})

// verification adresse
address.addEventListener("change", () => {
    const value = address.value
    const errorMsg = document.getElementById("addressErrorMsg")
    isValid("address", value, errorMsg, "Veuillez saisir votre addresse !", "Veuillez saisir une addresse correct !")
})

// verification city
city.addEventListener("change", () => {
    const value = city.value
    const errorMsg = document.getElementById("cityErrorMsg")
    isValid("city", value, errorMsg, "Veuillez saisir votre ville !", "Veuillez saisir une ville correct !")
})

// verification email
email.addEventListener("change", () => {
    const value = email.value
    const errorMsg = document.getElementById("emailErrorMsg")
    isValid("email", value, errorMsg, "Veuillez saisir votre email !", "Veuillez saisir un email correct !")
})



// order
var formOrder = {}
const orderButton = document.getElementById("order")
orderButton.addEventListener('click', ()=>{
    if(firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == ""){
        alert("Veuillez remplir tous les champs")
    }else{
        formOrder = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        }
        requestOrder()

    }
    
})
const productsID = []
for (const item of products) {
    productsID.push(item.idItem)
}
function requestOrder() {
    // Données à envoyer
    const order = {
        contact: formOrder,
        products: productsID
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
            response(data.orderId);
        })
}
function response(orderId) {
    localStorage.clear();
    document.location.href = `confirmation.html?id=${orderId}`;
}