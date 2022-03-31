// definir l'order Id 
const orderId = getOrderId();
showOrderId(orderId);
clearCache();


//--------------------------- fonction pour recuperer l'Id order 
function getOrderId() { 
    const queryString = window.location.search;
    const urlParms = new URLSearchParams(queryString);
    return urlParms.get('orderId');
}
//-----------------------------

//--------------------------- fonction qui recupere la value de l'orderID et qui la met sous format texte + chiffres
function showOrderId(value) {
    const orderIdshow = document.getElementById('orderId');
    orderIdshow.textContent = value;
}
//---------------------------------


//--------------------------- fonction qui permet de clear le cache automatiquement une fois qu'une commaande a été passée
function clearCache() {
    const cacheClear = window.localStorage;
    cacheClear.clear();
}
//------------------------------