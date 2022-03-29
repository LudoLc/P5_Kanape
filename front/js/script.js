const url = 'http://localhost:3000/api/products';


// *************************************INDEX******************************/
fetch(url)
.then(response => response.json())
.then(response => {
    response.forEach(function getKanap(canape){
        const parent = document.getElementById('items'); 
        const link = document.createElement('a'); // creation balise a
        link.setAttribute('href', './product.html?id=' + canape._id); // attribut href avec lien du produit + id du produit en specifique
        parent.appendChild(link);  // methode DOM pour donner a link le parent "paren"
        const article = document.createElement('article'); // creation const article 
        link.appendChild(article); // dom link a article 
        const img = document.createElement('img'); // creation const ilg 
        img.setAttribute('src', canape.imageUrl); // creation attribut src et de l'url de l'image par produit 
        img.setAttribute('alt', "Lorem ipsum dolor sit amet," + canape.name); // creation attribut alt de l'image + text avec le nom du canape en specifique
        const h3 = document.createElement('h3'); // creation titre h3 
        h3.textContent = canape.name;  // on fill le texte avec le nom en specifique du canape 
        h3.classList.add('productName'); // on rajoute la classe productName
        const p = document.createElement('p') ; // creation du p
        p.textContent= canape.description; // ajout du texte de description pour chaque produit 
        p.classList.add('productDescription'); // ajout class productDescription 
        article.appendChild(img);  // dom img a article 
        article.appendChild(h3); // dom h3 a article 
        article.appendChild(p); // dom p a article 
        console.log(article);
    })
    
})
.catch(error => alert("Erreur : " + error));


