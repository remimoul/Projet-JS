/************************************
 * 
 * Délcarations des variables globales et fonctions appelées au chargement de la page
 * 
 ************************************/

// Mettre à jour le panier en fonction du contenu enregistré dans localStorage
miseAJourPanier();
// Supprimer les anciennes fiches de cours
const anciennesFiches = document.querySelectorAll('.course__item');
anciennesFiches.forEach(function(item){
    item.remove();
});

// Génerer l'affichage dynamique des fiches de cours
for(let compteur = 1; compteur < 6; compteur ++){
    affichageDynamique(compteur);
};

// Charger les 5 cours
const lienCoursUIUX = document.querySelector('[data-id="1"]');
const ficheUIUX = lienCoursUIUX.parentNode.parentNode;
let showUIUX = true;
const lienCoursPHP = document.querySelector('[data-id="2"]');
const fichePHP = lienCoursPHP.parentNode.parentNode;
let showPHP = true;
const lienCoursREACT = document.querySelector('[data-id="3"]');
const ficheREACT = lienCoursREACT.parentNode.parentNode;
let showREACT = true;
const lienCoursNODE = document.querySelector('[data-id="4"]');
const ficheNODE = lienCoursNODE.parentNode.parentNode;
let showNODE = true;
const lienCoursMYSQL = document.querySelector('[data-id="5"]');
const ficheMYSQL = lienCoursMYSQL.parentNode.parentNode;
let showMYSQL = true;

// Charger la fonction pour récupérer les cliques sur les boutons
recoverid();
// Mettre à jour les quantitées disponibles sur la page HTML
updateAvailabilites();
displayAvailabilites();
afficherIndisponible();


/************************************
 * 
 * Fonction pour gérer les cliques sur les boutons d'achat
 * 
 ************************************/

// Créer une fonction pour savoir sur quel bouton on a cliqué
function recoverid(){
    // Charger tous les boutons avec la classe add-to-cart
    const buttons = document.querySelectorAll('.add-to-cart');
    // Appliquer un événement pour tous les boutons
    // item est un terme "générique" qui correspond à chaque bouton
    buttons.forEach(function(item){
        item.addEventListener("click", function(){
            // Récupérer l'attribut du bouton
            let boutonclique = item.getAttribute('data-id');

            // Vérifier s'il reste des stocks disponbile
            let disponibilite = checkAvailabilities(boutonclique);

            // Enregistrer les données dans localStorage si disponibilité sinon envoyé un message d'erreur
            if(disponibilite == true){
                // Enregistrer dans localStorage l'attribut récupéré
                saveInLocalStorage(boutonclique);
                miseAJourQuantitePanier(calculQuantitePanier());
                updateAvailabilites();
                displayAvailabilites();
                ajouterNotification(notificationAjoutPanier, boutonclique);
                afficherIndisponible();
                // Ajoter une ligne dans le panier
                ajouteLigne(boutonclique);
            }else{
                // Ajouter une notification correspondant au cours cliqué
                ajouterNotification(notificationCoursIndisponibleDebut,boutonclique);
                // Changer le style pour visualiser que le cours est indisponible
                afficherIndisponible();
            };
        });
    });
};

// Vérifier s'il y a un élément panier dans localStorage sinon en créer un et le renvoyer
function checkPanierlocalStorage(){
    // Créer une variable test qui recherche une clée Panier dans localStorage
    let testPanier = window.localStorage.getItem("Panier");
    // S'il n'y a pas de panier dans le localStorage en créer un sinon récupérer celui qui existe
    if (testPanier == null){
        // Créer un objet
        let panier = {
            Article:[],
            QTT:[],
            Disponibilite:[]
        };

        return panier;
    }else{
        // Récupérer le panier existant dans localStorage
        let panierJSON = window.localStorage.getItem("Panier");

        // Convertir le panier de JSON vers object JS
        let panier = JSON.parse(panierJSON);

        return panier;
    };
};

// Créer une fonction pour enregistrer dans le localStore
function saveInLocalStorage(value){
    // Créer une clée
    let key = "Panier";

    // Récupérer le panier dans le localStorage
    let panier = checkPanierlocalStorage();

    // Ajouter les données liées au bouton cliqué
    panier.Article.push(value);

    // Convetir en JSON et enregistrer dans localStorage 
    stockageObject= JSON.stringify(panier);

    // Enregistrer dans localstore la clé ainsi que la valeur qui a été utilisée comme argument de la fonction
    window.localStorage.setItem(key, stockageObject);
};

// Calculer les quantités de cours dans le panier
function calculQuantitePanier(){ 
    // Charger le panier enregistré dans localStorage
    let panier = checkPanierlocalStorage();
    // Mettre à 0 les 5 compteurs
    let quantiteCours1, quantiteCours2, quantiteCours3, quantiteCours4, quantiteCours5;
    quantiteCours1 = quantiteCours2 = quantiteCours3 = quantiteCours4 = quantiteCours5 = 0;

    // Calculer pour chaque valeur de panier combien de fois elle revient
    panier.Article.forEach(function(valeurPanier){
        if (valeurPanier == 1){
            quantiteCours1++;
        }else if(valeurPanier == 2){
            quantiteCours2++;
        }else if(valeurPanier == 3){
            quantiteCours3++;
        }else if(valeurPanier == 4){
            quantiteCours4++;
        }else if(valeurPanier == 5){
            quantiteCours5++;
        };
    });

    // Créer un tableau contenant les quantités pour tous les cours
    let tableauQuantite = [quantiteCours1,quantiteCours2,quantiteCours3,quantiteCours4,quantiteCours5];
    return tableauQuantite;
};

// Fonction permettant de mettre à jour la quanité de cours dans le localStorage 
function miseAJourQuantitePanier(table){ 
    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();

    // Créer une clée
    let key = "Panier";

    // Ajouter les données calculées de quantité dans l'objet panier
    panier.QTT = table;

    // Convetir en JSON et enregistrer dans localStorage 
    stockageObject= JSON.stringify(panier);

    // Enregistrer dans localstore la clé ainsi que la valeur qui a été utilisée comme argument de la fonction
    window.localStorage.setItem(key, stockageObject);
};

/* ------------------------------------------------------
LA FONCTION AFFICHAGE PANIER - REMI & JAMES
------------------------------------------------------- */

function ajouteLigne(idCours){

    // Créer une variable test qui recherche une clée Panier dans localStorage
    let panierProduit = checkPanierlocalStorage();

    // Récupération d'une référence à la table
    const refTable = document.querySelector('tbody');
    // Insère une ligne dans la table à l'indice de ligne 0
    let nouvelleLigne = refTable.insertRow(0);

    // Insère une cellule dans la ligne à l'indice n
    let nouvelleCellule0 = nouvelleLigne.insertCell(0);
    let nouvelleCellule1 = nouvelleLigne.insertCell(1);
    let nouvelleCellule2 = nouvelleLigne.insertCell(2);
    let nouvelleCellule3 = nouvelleLigne.insertCell(3);
    let nouvelleCellule4 = nouvelleLigne.insertCell(4);

    // Ajoute un nœud texte à chaque cellule à partir du contenu de COURSES

    let cell0 = document.createElement('img');
    cell0.setAttribute('src',"img/courses/"+COURSES[idCours]['img']);
    let cell1 = document.createTextNode(COURSES[idCours]["title"]);
    let cell2 = document.createTextNode(COURSES[idCours]["price"]);
    let cell3 = document.createTextNode(panierProduit.QTT[idCours-1]);
    let cell4 = document.createElement("div");
    cell4.className=("supprimer-item");
    cell4.innerHTML ="X";
    cell4.style.cursor="pointer";
      
    cell4.addEventListener("click", function(){
        // Supprime le bouton puis son parent
        let cible =this.parentElement.parentElement;
        cible.remove();
    });

    // Créer les cellules de la ligne
    nouvelleCellule0.appendChild(cell0);
    nouvelleCellule1.appendChild(cell1);
    nouvelleCellule2.appendChild(cell2);
    nouvelleCellule3.appendChild(cell3);
    nouvelleCellule4.appendChild(cell4);
}

/************************************
 * 
 * Gestion des quantités
 * 
 ************************************/

// Fonction pour vérifier si les cours sont encore disponibles
function checkAvailabilities(idATester){

    // Récupérer le nombre maximum de cours disponible dans la constante COURSES
    let disponibiliteMax = COURSES[idATester]['stock'];

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();
    let tableauQuantite = panier.QTT;

    // Créer une variable simulant la nouvelle disponibilité
    let quantiteATester;
    
    // Si le tableau dans localStorage est vide mettre la quantité à 0 sinon récupérer la valeur et ajouter +1 pour simuler la prochaine valeur
    if(tableauQuantite.length == 0){
        quantiteATester = 0;
    }else{
        // Calculer la quantité dans localStorage plus un
        quantiteATester = tableauQuantite[idATester-1] + 1;
    };

    // Renvoyer un résultat différent en fonction de la comparaison entre le nombre de place disponible et celui à tester
    if(disponibiliteMax >= quantiteATester){
        return true; 
    }else{
        return false;
    };
};

// Fonction pour mettre à jour dans localStorage le nombre de place disponible
function updateAvailabilites(){

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();

    // Vérifier si un tableau disponibilité existe dans localStorage
    // Créer le tableau s'il n'existe pas
    if (panier.Disponibilite.length == 0){
        panier.Disponibilite = [0,0,0,0,0];
    };

     // Calculer le nombre de places disponbiles
    for (let compteur = 0; compteur < 5; compteur ++){
        // Calcul à partir du stock disponible et de la quantité enregistrée dans le localStorage
        panier.Disponibilite[compteur] = COURSES[compteur+1]['stock'] - panier.QTT[compteur];
        // Vérifier si panier.Disponibilite[compteur] est un nombre.
        // Lors du premier chargement ce n'est pas un nombre (NaN) car localStorage est vide.
        // Dans ce cas on lui déclare la valeur max disponible.
        if(isNaN(panier.Disponibilite[compteur]) == true){
            panier.Disponibilite[compteur]=COURSES[compteur+1]['stock'];
        };
    };

    // Mettre à jour le tableau dans localStorage
    // Créer une clée
    let key = "Panier";

    // Convetir en JSON et enregistrer dans localStorage 
    stockageObject= JSON.stringify(panier);

    // Enregistrer dans localstore la clé ainsi que la valeur qui a été utilisée comme argument de la fonction
    window.localStorage.setItem(key, stockageObject);
};

// Fonction pour mettre à jour dans localStorage le nombre de place disponible après la suppression d'un cours
function updateAvailabilitesAfterDeletion(idArticle){

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();

    // Calculer le nombre de place disponbile
    panier.Disponibilite[idArticle] += 1;

    // Mettre à jour le tableau dans localStorage
    // Créer une clée
    let key = "Panier";

    // Convetir en JSON et enregistrer dans localStorage 
    stockageObject= JSON.stringify(panier);

    // Enregistrer dans localstore la clé ainsi que la valeur qui a été utilisée comme argument de la fonction
    window.localStorage.setItem(key, stockageObject);
};

// Fonction pour afficher le nombre de cours encore disponible sur la pge HTML
function displayAvailabilites(){

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();
    let tableauDisponibilite = panier.Disponibilite;

    // Charger le span contenant la classe stock dans pour chacune des fiches de cours
    let quantiteFicheUIUX = ficheUIUX.querySelector('.stock');
    let quantiteFichePHP = fichePHP.querySelector('.stock');
    let quantiteFicheREACT = ficheREACT.querySelector('.stock');
    let quantiteFicheNODE = ficheNODE.querySelector('.stock');
    let quantiteFicheMYSQL = ficheMYSQL.querySelector('.stock');

    // Mettre à jour la quantité dans la partie HTML
    quantiteFicheUIUX.innerHTML = tableauDisponibilite[0];
    quantiteFichePHP.innerHTML = tableauDisponibilite[1];
    quantiteFicheREACT.innerHTML = tableauDisponibilite[2];
    quantiteFicheNODE.innerHTML = tableauDisponibilite[3];
    quantiteFicheMYSQL.innerHTML = tableauDisponibilite[4];
};

// Fonction pour modifier l'affichage des cours indisponibles
function afficherIndisponible(){

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();

    // Tester pour chaque cours s'il faut modifier l'affichage

    if(panier.Disponibilite[0] == 0){
        ficheUIUX.style.border="solid 5px red";
        ficheUIUX.style.opacity="0.5";
    }else{
        ficheUIUX.style.border="1px solid rgba(0,0,0,0.25)";
        ficheUIUX.style.opacity="1.0";
    };
    
    if(panier.Disponibilite[1] == 0){
        fichePHP.style.border="solid 5px red";
        fichePHP.style.opacity="0.5";
    }else{
        fichePHP.style.border="1px solid rgba(0,0,0,0.25)";
        fichePHP.style.opacity="1.0";
    };
    
    if(panier.Disponibilite[2] == 0){
        ficheREACT.style.border="solid 5px red";
        ficheREACT.style.opacity="0.5";
    }else{
        ficheREACT.style.border="1px solid rgba(0,0,0,0.25)";
        ficheREACT.style.opacity="1.0";
    };
    
    if(panier.Disponibilite[3] == 0){
        ficheNODE.style.border="solid 5px red";
        ficheNODE.style.opacity="0.5";
    }else{
        ficheNODE.style.border="1px solid rgba(0,0,0,0.25)";
        ficheNODE.style.opacity="1.0";
    };

    if(panier.Disponibilite[4] == 0){
        ficheMYSQL.style.border="solid 5px red";
        ficheMYSQL.style.opacity="0.5";
    }else{
        ficheMYSQL.style.border="1px solid rgba(0,0,0,0.25)";
        ficheMYSQL.style.opacity="1.0";
    };
};

/************************************
 * 
 * Afficher des notifications
 * 
 ************************************/

// Déclarer les messages qui seront utilisés dans les notifications
const notificationAjoutPanier = " a été ajouté au panier !";
const notificationSuppressionPanier = " a été supprimé du panier !";
const notificationCoursIndisponibleDebut = "Le cours ";
const notificationCoursIndisponibleFin = " n'est plus disponible";
const notificationPanierVide = "Le panier a été vidé";

// Déclarer une position de départ pour l'ajout des notifications
let compteurPosition = 0;

function ajouterNotification(messageAffiche, idCours){
    // Créer le conteneur de la notification
    const notificationContainer = document.createElement('div');
    // Ajouter un attribut avec l'ID
    notificationContainer.setAttribute('id','notification_container');
    // Modifier le z-index pour éviter que les notifications apparaissent derrière les fiches de cours sur les petits écrans
    notificationContainer.style.zIndex = "999"; 
    document.querySelector('#header').appendChild(notificationContainer);
    // Adapter la position où apparait les notifications
    if(compteurPosition ==0){
        notificationContainer.style.top= "40px";
    }else if(compteurPosition == 1){
        notificationContainer.style.top= "120px";
    }else if(compteurPosition == 2){
        notificationContainer.style.top= "200px";
    }else if(compteurPosition == 3){
        notificationContainer.style.top= "280px";
    }else if(compteurPosition == 4){
        notificationContainer.style.top= "360px";
    }else if(compteurPosition == 5){
        notificationContainer.style.top= "440px";
    }else if(compteurPosition == 6){
        notificationContainer.style.top= "520px";
    }else if(compteurPosition == 7){
        notificationContainer.style.top= "600px";
    }else if(compteurPosition == 8){
        notificationContainer.style.top= "680px";
    };

    // Incrémenter le compteur de position
    compteurPosition++;
    
    // Créer la div de contenu
    const notificationContent = document.createElement('div');
    notificationContainer.appendChild(notificationContent);
    notificationContent.classList.add('content');

    // Ajouter une image dans la div de contenu
    const notificationImage = document.createElement('img');
    notificationContent.appendChild(notificationImage);
    notificationImage.setAttribute('src','img/info.png');
    
    // Ajouter du texte dans la div de contenu
    const notificationTexte = document.createElement('p');
    notificationContent.appendChild(notificationTexte);

    // Adapter le contenu affiché en fonction du bouton sur lequel on a cliqué
    if(messageAffiche == " a été ajouté au panier !"){
        if(idCours == 1){
            notificationTexte.innerText= "UIUX" + messageAffiche;
        }else if(idCours == 2){
            notificationTexte.innerText= "PHP 8" + messageAffiche;
        }else if(idCours == 3){
            notificationTexte.innerText= "REACT JS" + messageAffiche;
        }else if(idCours == 4){
            notificationTexte.innerText= "NODE JS" + messageAffiche;
        }else if(idCours == 5){
            notificationTexte.innerText= "MYSQL" + messageAffiche;
        };
    }else if(messageAffiche == " a été supprimé du panier !"){
        if(idCours == 1){
            notificationTexte.innerText= "UIUX" + messageAffiche;
        }else if(idCours == 2){
            notificationTexte.innerText= "PHP 8" + messageAffiche;
        }else if(idCours == 3){
            notificationTexte.innerText= "REACT JS" + messageAffiche;
        }else if(idCours == 4){
            notificationTexte.innerText= "NODE JS" + messageAffiche;
        }else if(idCours == 5){
            notificationTexte.innerText= "MYSQL" + messageAffiche;
        };
    }else if(messageAffiche == "Le cours "){
        if(idCours == 1){
            notificationTexte.innerText= messageAffiche + "UIUX" + notificationCoursIndisponibleFin;
        }else if(idCours == 2){
            notificationTexte.innerText= messageAffiche + "PHP 8" + notificationCoursIndisponibleFin;
        }else if(idCours == 3){
            notificationTexte.innerText= messageAffiche + "REACT JS" + notificationCoursIndisponibleFin;
        }else if(idCours == 4){
            notificationTexte.innerText= messageAffiche + "NODE JS" + notificationCoursIndisponibleFin;
        }else if(idCours == 5){
            notificationTexte.innerText= messageAffiche + "MYSQL" + notificationCoursIndisponibleFin;
        };
    }else if(idCours == "Suppression"){
        notificationTexte.innerText= notificationPanierVide;
    }
    
    // Supprimer la notification au bout de 3 secondes (3000 ms)
    setTimeout(function(){
        // Enlever la notification
        notificationContainer.remove();
        // Réduire le compteur de position
        compteurPosition--;
    }, 3000);  
};

/************************************
 * 
 * Mise à jour du panier au chargement de la page
 * 
 ************************************/

function miseAJourPanier(){

    // Récupérer le panier conservé dans le localStorage
    let panier = checkPanierlocalStorage();

    // Regarder pour chaque élément de panier et ajouter une ligne dans le panier pour chacune
    panier.Article.forEach(function(coursPanier){
        ajouteLigne(coursPanier);
    });
};

/************************************
 * 
 * Vider le panier
 * 
 ************************************/

// Charger le bouton pour effacer le contenu du panier
const emptyCart = document.querySelector('#empty-cart');

// Effacer le contenu du localStorage lorsque l'on clique sur le bouton’
emptyCart.addEventListener("click",function(){
    // Effacer le contenu de localStorage
    window.localStorage.clear();

    // Mettre à jour les valeurs de disponibilité et leur contenu en HTML.
    updateAvailabilites();
    displayAvailabilites();
    // Notification de suppression
    ajouterNotification(notificationPanierVide,"Suppression");
    // Mettre à jour les cours disponibles / indisponibles
    afficherIndisponible();

    // Effacer tout le contenu du tableau du panier
    // Tant que tbody a des enfants supprimer tous les enfants de tbody
    while (document.querySelector('tbody').firstChild) {
        document.querySelector('tbody').removeChild(document.querySelector('tbody').lastChild);
    };
});

/************************************
 * 
 * Affichage dynamique
 * 
 ************************************/

function affichageDynamique(idCours){
    /*Tableau pour moduler les classes .mark.m_1, .mark.m_2.... */
    let marks = ['m_1','m_2','m_3','m_4','m_5'];  
    /* Récupération du mark (note des utilisateurs) dans le tableau COURSES 
    moins 1 pour faire correspondre au tableau marks */
    let indice_mark = COURSES[idCours]['mark']-1;

    //Récupération de l'extention .m_X 
    let score_mark = marks[indice_mark];

    //Récupération des éléments de classe container
    let cours_contener_all = document.querySelectorAll(".courses__container");

    //selection du deuxieme cours contener. Le premier sert pour le panier vide
    let courses_container = cours_contener_all[1];

    //Création de la premiere Div
    let div_course__item = document.createElement("div");
    //Ajout de la classe cours__item à la div
    div_course__item.className="course__item";
    // On met la Div en tant qu'enfant de cours_contener
    courses_container.appendChild(div_course__item);

    // Création de l'image
    let figure_cours_img = document.createElement("figure");
    figure_cours_img.className="course_img";
    div_course__item.appendChild(figure_cours_img);
    let img_cours = document.createElement("img");
    //Utiliser setAttribute pour l'argument source: src de la balise img
    img_cours.setAttribute('src',"img/courses/"+COURSES[idCours]["img"]);
    figure_cours_img.appendChild(img_cours);

    // Création de la carte
    let div_info__card = document.createElement("div");
    div_info__card.className="info__card";
    div_course__item.appendChild(div_info__card);

    // Création du titre
    let h4 = document.createElement("h4");
    h4.innerHTML = COURSES[idCours]["title"];
    div_info__card.appendChild(h4);

    // Création de la note
    let figure_mark = document.createElement("figure");
    figure_mark.className="mark "+score_mark;
    div_info__card.appendChild(figure_mark);
    let img_rates = document.createElement("img");
    img_rates.setAttribute('src',"img/rates.png");
    figure_mark.appendChild(img_rates);

    // Création du premier prix
    let premier_p = document.createElement("p");
    div_info__card.appendChild(premier_p);
    let span_price = document.createElement("span");
    span_price.className="price";
    span_price.innerHTML = COURSES[idCours]["initial_price"]+" €";
    premier_p.appendChild(span_price);

    // Création du prix avec réduction
    let span_discount = document.createElement("span");
    span_discount.className="discount";
    span_discount.innerHTML = COURSES[idCours]["price"]+" €";
    premier_p.appendChild(span_discount);
    let deuxieme_p = document.createElement("p");
    div_info__card.appendChild(deuxieme_p);

    // Création du nombre de place disponible
    deuxieme_p.innerHTML = "Disponible:";
    let span_stock = document.createElement("span");
    span_stock.className="stock";
    span_stock.innerHTML = COURSES[idCours]["stock"] ;
    deuxieme_p.appendChild(span_stock);

    // Création du lien
    let a_Ajout_Panier = document.createElement("a");
    div_info__card.appendChild(a_Ajout_Panier);
    // Ici aussi utiliser setAttribute pour le href de l'ancre <a>
    a_Ajout_Panier.setAttribute("href","#");
    a_Ajout_Panier.className="add-to-cart";
    // aussi setAttribute pour l'argument data-id
    a_Ajout_Panier.setAttribute("data-id",idCours);

    // Ajouter le logo et le texte dans le lien
    let i_Fa_Fa = document.createElement("i");
    i_Fa_Fa.className = "fa fa-cart-plus";
    a_Ajout_Panier.appendChild(i_Fa_Fa);
    let a_Ajout_Panier_text = document.createTextNode("Ajouter au panier");
    a_Ajout_Panier.appendChild(a_Ajout_Panier_text);
};