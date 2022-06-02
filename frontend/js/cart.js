var localStorageProducts = JSON.parse(localStorage.getItem("products"));
products = [];
const items = document.getElementById("cart__items");

// S'il y a bien quelques chose dans le localStorage :
if (localStorageProducts && localStorageProducts.length != 0) {

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        
    }
    for (let i = 0; i < localStorageProducts.length; i++) {

        // recupérer les information de l'API de chaque produit
        addProduct();
        const {idItem, colorItem} =localStorageProducts[i],
        index = localStorageProducts.findIndex( item => item.idItem+item.colorItem == idItem+colorItem ),
        product = products[index];

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
        article.dataset.id = product.idItem;
        article.dataset.color = product.colorItem;
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

    //ne pas afficher les blocs .cart__price et .cart__order
    cartOrder.style.display='none';
}

const inputsQtity = document.querySelectorAll(".itemQuantity");
inputsQtity.forEach((inputQtity) => {
    inputQtity.addEventListener('change', (e) => {
        const 
            newQtity = e.target.value,
            {id, color} = e.target.closest("article").dataset,
            idSpec = id+color,
            productIndex = localStorageProducts.findIndex( item => item.idSpec == idSpec );
        
        // si la quantité de produit change et dans les normes alors ça met à jour les changement
        if(newQtity != localStorageProducts[productIndex].qtity && (0 < newQtity && newQtity <= 100 )){
            localStorageProducts[productIndex].qtity = newQtity
            localStorage.setItem("products", JSON.stringify(localStorageProducts));
            total()
        }
        // si non on supprime l'article
        else {
            deleteElement(productIndex)
        }
    })
})
function addProduct() {
    console.log('add')
}
function total() {
    var totalQuantity = 0
    var totalPrice = 0

    for(const product of localStorageProducts){
        totalQuantity += Number(product.qtity)
        totalPrice += Number(product.qtity) * Number(product.priceItem)
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity
    document.getElementById("totalPrice").innerHTML = totalPrice
}

// deleteItem || Supprimer l'article en cliquant sur supprimer
const item = document.querySelectorAll(".deleteItem")
item.forEach((item) => {
    item.addEventListener('click', e => {
         
        const 
            {id, color} = e.target.closest("article").dataset,
            idSpec = id+color,
            productIndex = localStorageProducts.findIndex( item => item.idSpec == idSpec ),
            product = localStorageProducts[productIndex];
        
        // si confirme alors ça supprime l'article
        if(confirm(`Vous êtes sur le point de suprimer cette article : ${product.nameItem+"  "+product.colorItem}`)){
            deleteElement(productIndex);
        }
    })
})

function deleteElement(index) {
    localStorageProducts.splice(index, 1)
    localStorage.setItem("products", JSON.stringify(localStorageProducts))
    window.location.reload()
}




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
firstName.addEventListener("change", (e) => {
    const field = 'name',
    errorMsg = document.getElementById("firstNameErrorMsg"),
    message = "Veuillez saisir votre prénom !";
    cPName = verifNames({e, name, errorMsg, message});
})

// verification nom
lastName.addEventListener("change", (e) => {
    const field = 'name',
    errorMsg = document.getElementById("firstNameErrorMsg"),
    message = "Veuillez saisir votre nom !";
    cName = verifNames({e, name, errorMsg, message});
})



function verifNames({e, field, errorMsg, message}) {
    const test = () => {
        if(field == 'name') {
            /^[^@&"()!_$*€£`+=\/;?#\d]+$/.test(e.target.value)
        }
    };
    if (test) {
        e.target.style.border = "0";
        errorMsg.innerText = "";
        return 0;
    } else {
        e.target.style.border = "2px solid red"
        errorMsg.innerText = message;
        return 1;
    }
}


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
const 
    orderButton = document.getElementById("order"),
    form = document.querySelector('.cart__order__form');

orderButton.addEventListener('click', ()=>{

    if(firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == ""){
        for (let i = 0; i < form.length-1; i++) {
            const e = form[i];
            if(e.value == '') {
                e.style.border = "2px solid red";
            }
        }
        //alert("Veuillez remplir tous les champs")
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
const localStorageProductsID = []
for (const item of localStorageProducts) {
    localStorageProductsID.push(item.idItem)
}
function requestOrder() {
    // Données à envoyer
    const order = {
        contact: formOrder,
        localStorageProducts: localStorageProductsID
    };
    console.log(order)
    // En-tête de la requête
    const entete = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {"Content-Type": "application/json"},
    };

    fetch("http://localhost:3000/api/localStorageProducts/order", entete)
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