
// récupération de l' ID du confirmation
const id = new URLSearchParams(window.location.search).get('id');
// test n°  | console.log(id)

// Si l' ID du confirmation alors on se rederige directement ver la page d'acceuil
if (id == null) {
    window.location.href = './index.html';
}

// imbrication de l'ID de confirmation
const orderId = document.getElementById("orderId");
orderId.innerHTML = id;
