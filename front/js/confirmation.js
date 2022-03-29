// definir l'order Id 
const orderId = getOrderId();
showOrderId(orderId);
clearCache();

function getOrderId() { // appel de l'order ID
const queryString = window.location.search;
const urlParms = new URLSearchParams(queryString);
return urlParms.get('orderId');
}

//console.log(orderId);

function showOrderId(orderId) {
    const orderIdshow = document.getElementById('orderId');
    orderIdshow.textContent = orderId;
}

// eviter d'avoir le clear cache rempli et le vider .

function clearCache() {
    const cacheClear = window.localStorage;
    cacheClear.clear();
    console.log(cacheClear);
}