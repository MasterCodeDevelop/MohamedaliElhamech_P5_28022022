const id = new URLSearchParams(window.location.search).get('id')
console.log(id)
const orderId = document.getElementById("orderId")
orderId.innerHTML = id
