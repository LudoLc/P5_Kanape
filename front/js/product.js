//**PRODUCTS***/
const myNewId = window.location.search;
const urlParams = new URLSearchParams(myNewId);
const productId = urlParams.get("id");
const urlProduct = `http://localhost:3000/api/products/${productId}`;

fetch(urlProduct)
.then(response => response.json())
.then(product => {
    const parent = document.getElementsByClassName('item__img')[0];
    const imgProduct = document.createElement('img');
    imgProduct.setAttribute('src', product.imageUrl);
    imgProduct.setAttribute('alt', "Photographie d'un canapé");
    console.log(parent);
    parent.appendChild(imgProduct);
//
    console.log(product);
    const parentTitlePrice = document.getElementsByClassName('item__content__titlePrice');
    const productTitle = document.getElementById('title');
    productTitle.innerText = product.name;
    console.log(productTitle);
//
    const price = document.getElementById('price');
    price.innerText = product.price;
//
    const textDescription = document.getElementById('description');
    textDescription.innerText = product.description;
//
    const select = document.getElementById('colors');

    product.colors.forEach((color) => { 
            const optionsColor = document.createElement('option');
            optionsColor.value = color;
            optionsColor.textContent = color;
            select.appendChild(optionsColor);
    })
    eventButton(product);
})



// ecouter le click et return true ou false
function eventButton(product) {
    const button = document.getElementById('addToCart');
    if(button) {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const quantity = document.getElementById('quantity').value;
            const color = document.getElementById('colors').value;
            //console.log(event);
            // console.log(color);
            // console.log(quantity);
            if(color == '' || color == null || quantity == '' || quantity < 1 || quantity > 100) {
                alert("Veuillez selectionner un produit ainsi qu'une couleur SVP ! ")
            } else {
                savingShop(product);
                const wantRedicrect = window.confirm("Avez-vous fini votre achat ? Si non, vous pouvez continuer votre visite sur le site. Votre panier sera sauvegardé. ");
                if(wantRedicrect === true) {
                    window.location.href = "cart.html";
                }
            }
        })
    }
}
// verifie si le panier existe deja 
function ifExist(array, value) {
    for (let elem of array) {
        if (elem.id === value.id && elem.color === value.color) {
            return true
        }
    }
    return false
};


// enregistrer le panier 

function savingShop(product) {
    // stockage : id / couleur / quantité
    const quantity = document.getElementById('quantity').value;
    const color = document.getElementById('colors').value;
    console.log(product._id);
    const productCart = {
        id: product._id,
        quantity: parseInt(quantity),
        color: color,
        name: product.name
    }
    
let panier = localStorage.getItem('panier');
if(!panier) {
    panier = [productCart];
    } else {
            panier = JSON.parse(panier)
                if(ifExist(panier, productCart)){
                    console.log('test')
                    const index = panier.findIndex(function (i) { //cherche l'index du produit dans le panier
                        return i.name == productCart.name;
                    });
                    panier[index].quantity += parseInt(quantity)
                } else {
                    panier.push(productCart)
                }
        }
    
    localStorage.setItem('panier', JSON.stringify(panier));
}

