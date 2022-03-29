//------------------------- recuperer le panier du localstorage: ---------------------
function getShop() { 
    const getItemCart =  localStorage.getItem('panier'); 
    console.log(getItemCart);
    if (!getItemCart) { 
        return []; //return tableau (si carte n'existe pas)
    }
    const getItemCart_json = JSON.parse(getItemCart); // prend une chaîne JSON puis la transforme en objet JavaScript. */
    return getItemCart_json;
}

function savingShop(panier) { // sauvegarde le panier dans le L.S 
    localStorage.setItem('panier', JSON.stringify(panier));
}

//----------------------------------------------------------------------------------
const productsOfPanier = getShop();

for(let product of productsOfPanier) {
    fetch(`http://localhost:3000/api/products/${product.id}`)
    .then(response => response.json())
    .then(data  => {
        const showProduct = {
            // données LS 
            id: product.id,
            quantity: product.quantity,
            color: product.color,
            name: product.name,
            // données manquantes à afficher :
            price: data.price,
            altTxt: data.altTxt,
            description: data.description,
            imageUrl: data.imageUrl
        }
        //console.log(showProduct);
        showPanierToDom(showProduct);
        cartPrice(showProduct);
        let quantityField = document.querySelector('.itemQuantity');
        quantityField.addEventListener('change', event => {
            updateProductQuantity(event.target)
            window.location.reload()
        })
        
        return showProduct;
    })
    .catch(error => alert("Erreur : " + error));
}

function showPanierToDom(showProduct) {
    // article 
    const parent = document.getElementById("cart__items"); // crea cart__item
    const article = document.createElement('article');
    article.classList.add("cart__item");
    article.dataset.id = showProduct.id;
    article.dataset.color = showProduct.color;
    parent.appendChild(article);
    const imgDiv = imgCartItem(showProduct);
    article.appendChild(imgDiv);
    const divDescription = cartItemContent(showProduct);
    article.appendChild(divDescription);
    const divSettings = cartItemContentSetting(showProduct);
    divDescription.appendChild(divSettings);
}



function imgCartItem(showProduct) {
    const div = document.createElement('div');
    div.classList.add("cart__item__img");
    const imgSrc = document.createElement('img');
    imgSrc.src = showProduct.imageUrl;
    imgSrc.alt = showProduct.altTxt;
    div.appendChild(imgSrc);
    return div;
}

function cartItemContent(showProduct) {
    const div1 = document.createElement('div');  // main div 
    div1.classList.add("cart__item__content");
    const div2 = document.createElement('div'); // div description 
    div2.classList.add("cart__item__content__description");
    const h2 = document.createElement('h2');
    h2.textContent = showProduct.name;
    const pColor = document.createElement('p');
    pColor.textContent = showProduct.color;
    const pPrice = document.createElement('p');
    pPrice.textContent = showProduct.price + '€';
    div1.appendChild(div2);
    div2.appendChild(h2);
    div2.appendChild(pColor);
    div2.appendChild(pPrice);
    return div1;
}

function cartItemContentSetting(showProduct) {
    const div1 = document.createElement('div');
    div1.classList.add('cart__item__content__settings');
    const div2 = document.createElement('div');
    div2.classList.add('cart__item__content__settings__quantity');
    const p = document.createElement('p');
    p.textContent = 'Qté : ';
    div2.appendChild(p);
    div1.appendChild(div2);
    const input = document.createElement('input');
    //input.addEventListener("click", updateProductQuantity);
    input.type = "number";
    input.classList = "itemQuantity";
    input.name ="itemQuantity";
    input.min = "1";
    input.max = "100";
    input.setAttribute('value', showProduct.quantity);
    div2.appendChild(input);
    const div3 = document.createElement('div');
    div3.classList.add('cart__item__content__settings__delete');
    div1.appendChild(div3);
    const pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Supprimer';
    div3.appendChild(pDelete);
    pDelete.addEventListener("click", () => {
        deleteProduct(showProduct)
    })
    return div1;
}

function deleteProduct(product) {
    const productToDelete = productsOfPanier.findIndex(panierProduct => {
        if(product.id === panierProduct.id && product.color === panierProduct.color){
            return true;
        }
    });
    productsOfPanier.splice(productToDelete, 1);
    savingShop(productsOfPanier);  // sauvegarde le panier supprimé 
    window.location.reload()
}


function cartPrice(showProduct) {
    let price = 0;
    const quantityArticle = document.getElementById('totalQuantity');
    let quantity = Number(quantityArticle.innerText) + Number(showProduct.quantity);
    quantityArticle.innerText = quantity;
    const priceArticle = document.getElementById('totalPrice');
    price = Number(priceArticle.innerText) + Number(showProduct.price * showProduct.quantity);
    priceArticle.innerText = price;
}

function updateProductQuantity(input) {
    //const input = event.target;
    const article = input.parentNode.parentNode.parentNode.parentNode;
    const productName = article.querySelector('.cart__item__content__description h2').textContent;
    const productColor = article.querySelector('.cart__item__content__description p').textContent;
    const itempUpdated = productsOfPanier.findIndex(prod => { // index du produit
        return prod.name === productName && prod.color === productColor
    }); // cherche le nom du premier article.
    productsOfPanier[itempUpdated].quantity = input.value;
    savingShop(productsOfPanier);
    
}

// ******************************** Fetch Formulaire ****************************
const nameRegex = /[a-z '\-àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ]+/i;
const cityRegex = /[a-z\-àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ .']+/i;
const addressRegex = /[a-z0-9àèìòùáéíóúýâêîôûãñõäëïöüÿçøåæœ \-',.]+/i;
const emailRegex = /.+\@.+\..+/;
function getRequestForm () {
    const formulaire = document.getElementsByClassName('cart__order__form');
    const firstName = document.getElementById('firstName').value; // recuperation value de l'element first name
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    console.log(nameRegex.test(firstName));
    // stockage dans un objet 
    const result = [];
    for(let product of productsOfPanier) {
        const id = product.id;
        result.push(id);
    }
    const body = {
        contact : {
            firstName,
            lastName,
            address,
            city,
            email
        },
        products : result
    }
    return body;
}

// Bouton commande 

const submitButton = document.getElementById('order');
submitButton.addEventListener("click", (event) => submit(event));



function formuValidation() {
    let valid = true;
    if (document.getElementById('firstName').value == "" || !nameRegex.test(document.getElementById('firstName').value)){
        document.getElementById('firstNameErrorMsg').innerText = "Veuillez entrer votre prénom!";
        valid = false;
    } else {
        document.getElementById('firstNameErrorMsg').innerText = "";
    }
    if (document.getElementById('lastName').value == "" || !nameRegex.test(document.getElementById('lastName').value)){
        document.getElementById('lastNameErrorMsg').innerText = "Veuillez entrer votre nom!";
        valid = false;
    } else {
        document.getElementById('lastNameErrorMsg').innerText = "";
    }
    if (document.getElementById('address').value == "" || !addressRegex.test(document.getElementById('address').value)){
        document.getElementById('addressErrorMsg').innerText = "Veuillez entrer votre addresse!";
        valid = false;
    } else {
        document.getElementById('addressErrorMsg').innerText = "";
    }
    if (document.getElementById('city').value == "" || !cityRegex.test(document.getElementById('city').value)){
        document.getElementById('cityErrorMsg').innerText = "Veuillez entrer votre ville!";
        valid = false;
    } else {
        document.getElementById('cityErrorMsg').innerText = "";
    }
    if (document.getElementById('email').value == "" || !emailRegex.test(document.getElementById('email').value)){
        document.getElementById('emailErrorMsg').innerText = "Veuillez entrer votre email! sous format : xx@xx.xx";
        valid = false;
    } else {
        document.getElementById('cityErrorMsg').innerText = "";
    }
    return valid;
}


function submit (event) {
    event.preventDefault();
    // console.log(document.getElementById('firstName').value);
    // console.log(document.getElementById('lastName').value);
    // console.log(document.getElementById('city').value);
    // console.log(document.getElementById('address').value);
    // console.log(document.getElementById('email').value);
    const body = getRequestForm();
    console.log(body);
    if (formuValidation()){
        fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',  //definit le format en Json
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data  => {
        console.log(data);
        window.location.replace(`./confirmation.html?orderId=${data.orderId}`);
    })
    .catch(error => alert("Erreur : " + error));
};   
}


