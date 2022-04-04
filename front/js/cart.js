//------------------------- recuperer le panier du localstorage: ---------------------
function getShop() {
    const getItemCart = localStorage.getItem("panier");
    if (!getItemCart) {
    return []; //return tableau vide (si carte n'existe pas)
}
    const getItemCart_json = JSON.parse(getItemCart); // prend une chaîne JSON puis la transforme en objet JavaScript. */
    return getItemCart_json;
}

function savingShop(panier) {
  // sauvegarde le panier dans le L.S
    localStorage.setItem("panier", JSON.stringify(panier));
}

//----------------------------------------------------------------------------------
const productsOfPanier = getShop();

//-------------------------------------------------- foncion fetch 
for (let product of productsOfPanier) {
    fetch(`http://localhost:3000/api/products/${product.id}`)
        .then((response) => response.json())
        .then((data) => {
            const showProduct = {
                // données Ldu local storage
                id: product.id,
                quantity: product.quantity,
                color: product.color,
                name: product.name,
                // données manquantes à afficher :
                price: data.price,
                altTxt: data.altTxt,
                description: data.description,
                imageUrl: data.imageUrl,
            };

            showCartToDom(showProduct);
            showCartPrice(showProduct);

            let quantityField = document.querySelector(".itemQuantity");

            quantityField.addEventListener("change", (event) => {
                updateProductQuantity(event.target);
                window.location.reload();
            });
            return showProduct;
        })
        .catch((error) => alert("Erreur : " + error));
}
//--------------------------------------------------------

//------------------------------- fonction pour afficher le produit 
function showCartToDom(showProduct) {
    const parent = document.getElementById("cart__items"); // crea cart__item
    const article = document.createElement("article");

    article.classList.add("cart__item"); // creation d'une liste de class
    article.dataset.id = showProduct.id;
    article.dataset.color = showProduct.color;
    parent.appendChild(article);

    const imgDiv = addImg(showProduct);
    article.appendChild(imgDiv);

    const divDescription = showItemContent(showProduct);
    article.appendChild(divDescription);

    const divSettings = addItemDescription(showProduct);
    divDescription.appendChild(divSettings);
}
//--------------------------------------

//----------------------------- fonction pour afficher l'image des divers canapés 
function addImg(imgCanape) { 
    const div = document.createElement("div"); //creat div la div parent
    div.classList.add("cart__item__img");

    const imgSrc = document.createElement("img");
    imgSrc.src = imgCanape.imageUrl;
    imgSrc.alt = imgCanape.altTxt;
    div.appendChild(imgSrc);

    return div; // return pour afficher le resultat
}
//------------------------------

//----------------------------fonction pour afficher le nom du produit + couleur + la couleur 
function showItemContent(item) {
    const div1 = document.createElement("div"); // main div
    div1.classList.add("cart__item__content");

    const div2 = document.createElement("div"); // div description
    div2.classList.add("cart__item__content__description");

    const h2 = document.createElement("h2");
    h2.textContent = item.name;

    const pColor = document.createElement("p");
    pColor.textContent = item.color;

    const pPrice = document.createElement("p");
    pPrice.textContent = item.price + "€";

    div1.appendChild(div2);
    div2.appendChild(h2);
    div2.appendChild(pColor);
    div2.appendChild(pPrice);

    return div1;

}
//------------------------------

//---------------------------- fonction pour ajouter le bouton supprimer avec le bon parametrage
function addItemDescription(item) {
    const div1 = document.createElement("div"); //crea main div
    div1.classList.add("cart__item__content__settings");

    const div2 = document.createElement("div");
    div2.classList.add("cart__item__content__settings__quantity");

    const p = document.createElement("p");
    p.textContent = "Qté : ";

    div2.appendChild(p);
    div1.appendChild(div2);

    const input = document.createElement("input");
    input.type = "number";
    input.classList = "itemQuantity";
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    input.setAttribute("value", item.quantity);
    div2.appendChild(input);

    const div3 = document.createElement("div");
    div3.classList.add("cart__item__content__settings__delete");
    div1.appendChild(div3);

    const pDelete = document.createElement("p");
    pDelete.classList.add("deleteItem");
    pDelete.textContent = "Supprimer";
    div3.appendChild(pDelete);
    pDelete.addEventListener("click", () => {
    // add event listener qui ecoute au click
        deleteProduct(item);
    }); 

    return div1;    
}
//--------------------------------------

//-------------------------------- fonction permettant la suppression d'articles 
function deleteProduct(product) {
    const productToDelete = productsOfPanier.findIndex((panierProduct) => {
        if (
        product.id === panierProduct.id &&
        product.color === panierProduct.color
        ) {
    return true;
    }
});
productsOfPanier.splice(productToDelete, 1);
savingShop(productsOfPanier); // sauvegarde le panier supprimé
window.location.reload();
}
//-----------------------------


//----------------------- fonction permettant  d'afficher le prix en fonction du nombre d'articles
function showCartPrice(data) {
let price = 0;
    const quantityArticle = document.getElementById("totalQuantity");
    let quantity =
        Number(quantityArticle.innerText) + Number(data.quantity);
    quantityArticle.innerText = quantity;

    const priceArticle = document.getElementById("totalPrice");
    price =
        Number(priceArticle.innerText) +
        Number(data.price * data.quantity);
        priceArticle.innerText = price;
}
//---------------------------------

//----------------------- fonction qui affiche les prix/ quantitté si modifications il y'a 
function updateProductQuantity(input) {
    const article = input.parentNode.parentNode.parentNode.parentNode;

    const productName = article.querySelector(
        ".cart__item__content__description h2"
    ).textContent;

    const productColor = article.querySelector(
        ".cart__item__content__description p"
    ).textContent;

    const itempUpdated = productsOfPanier.findIndex((prod) => {
        // index du produit
        return prod.name === productName && prod.color === productColor;
    }); // cherche le nom du premier article.
    productsOfPanier[itempUpdated].quantity = input.value;
    savingShop(productsOfPanier);
}
//----------------------------------------

// ******************************** Fetch Formulaire ****************************
const nameRegex = /[a-z '\-àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ]+/i;
const cityRegex = /[a-z\-àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ .']+/i;
const addressRegex = /[a-z0-9àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ \-',.]+/i;
const emailRegex = /.+\@.+\..+/;

function getRequestForm() {
const firstName = document.getElementById("firstName").value; // recuperation value de l'element first name
const lastName = document.getElementById("lastName").value;
const email = document.getElementById("email").value;
const city = document.getElementById("city").value;
const address = document.getElementById("address").value;
// stockage dans un objet des coordonnées de l'utilisateur
const result = [];
for (let product of productsOfPanier) {
    const id = product.id;
    result.push(id);
}
const body = {
    contact: {
    firstName,
    lastName,
    address,
    city,
    email,
    },
    products: result,
};
return body;
}

// Bouton commande

const submitButton = document.getElementById("order");
submitButton.addEventListener("click", (event) => {
    const panier = getShop();
    if (panier.length ==0) {
        alert("Votre panier est vide!");
        return
    } else {
        submit(event);
    }
});


//------------------------fonction de condition de validation du remplissage des differents champs du formulaire  

function isFirstNameValid(){
    if(
        document.getElementById("firstName").value == "" ||
        !nameRegex.test(document.getElementById("firstName").value)
    ){
        return false;
    } return true;
}

function isLastNameValid(){
    if(
        document.getElementById("lastName").value == "" ||
        !nameRegex.test(document.getElementById("lastName").value)
    ){
        return false;
    } return true;
}

function isAddressValid(){
    if(
        document.getElementById("address").value == "" ||
        !nameRegex.test(document.getElementById("address").value)
    ){
        return false;
    } return true;
}

function isCityValid(){
    if(
        document.getElementById("city").value == "" ||
        !nameRegex.test(document.getElementById("city").value)
    ){
        return false;
    } return true;
}

function isEmailValid(){
    if(
        document.getElementById("email").value == "" ||
        !nameRegex.test(document.getElementById("email").value)
    ){
        return false;
    } return true;
}

function formuValidation() {
let valid = true;
    if (!isFirstNameValid()) {
        document.getElementById("firstNameErrorMsg").innerText =
        "Veuillez entrer votre prénom!";
        valid = false;
    } else {
        document.getElementById("firstNameErrorMsg").innerText = "";
    }
    if (!isLastNameValid()) {
        document.getElementById("lastNameErrorMsg").innerText =
        "Veuillez entrer votre nom!";
        valid = false;
    } else {
        document.getElementById("lastNameErrorMsg").innerText = "";
    }
    if (!isAddressValid()) {
        document.getElementById("addressErrorMsg").innerText =
        "Veuillez entrer votre addresse!";
        valid = false;
    } else {
        document.getElementById("addressErrorMsg").innerText = "";
    }
    if (!isCityValid()) {
        document.getElementById("cityErrorMsg").innerText =
        "Veuillez entrer votre ville!";
        valid = false;
    } else {
        document.getElementById("cityErrorMsg").innerText = "";
    }
    if (!isEmailValid()) {
        document.getElementById("emailErrorMsg").innerText =
        "Veuillez entrer votre email! sous format : xxx@xx.xx";
        valid = false;
    } else {
        document.getElementById("cityErrorMsg").innerText = "";
    }
    return valid;
}

//---------------------------------------------

//------------------------------- fonction qui verifie qui si les données ont bien été saisies ==> page de confirmation
function submit(event) {
    event.preventDefault();
    const body = getRequestForm();
    if (formuValidation()) {
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                Accept: "application/json", //definit le format en Json
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((response) => response.json())
        .then((data) => {
            window.location.replace(`./confirmation.html?orderId=${data.orderId}`);
        })
        .catch((error) => alert("Erreur : " + error));
    }
}
//-----------------------------------