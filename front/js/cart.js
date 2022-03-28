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
function getrequestForm () {
    const formulaire = document.getElementsByClassName('cart__order__form');
    const firstName = formulaire.elements.firstName.value; // recuperation value de l'element first name
    const lastName = formulaire.elements.lastName.value;
    const email = formulaire.elements.email.value;
    const city = formulaire.elements.city.value;
    const adress = formulaire.elements.adress.value;
    
    // stockage dans un objet 
    const body = {
        contact : {
            firstName: firstName,
            lastName: lastName,
            adress: adress,
            city: city,
            email: email
        },
        products : result
    }
    const result = [];
    for(let product of productsOfPanier) {
        const id = product.id;
        result.push(id);
    }
    return body;
}
