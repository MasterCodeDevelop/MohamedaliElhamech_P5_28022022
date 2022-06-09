
// récupération de l' ID du confirmation
const id = new URLSearchParams(window.location.search).get('id');
// test n°  | console.log(id)

// imbrication de l'ID de confirmation
const orderId = document.getElementById("orderId");
orderId.innerHTML = id;
