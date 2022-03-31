// definir l'order Id 
const orderId = getOrderId();
showOrderId(orderId);
clearCache();

function getOrderId() { // appel de l'order ID
    const queryString = window.location.search;
    const urlParms = new URLSearchParams(queryString);
    return urlParms.get('orderId');
}

function showOrderId(value) {
    const orderIdshow = document.getElementById('orderId');
    orderIdshow.textContent = value;
}

// eviter d'avoir le clear cache rempli et le vider .

function clearCache() {
    const cacheClear = window.localStorage;
    cacheClear.clear();
    console.log(cacheClear);
}