/************************************
 * 
 * Barre de recherche
 * 
 ************************************/

// Charger la barre de recherche
const searchItem = document.querySelector("#search-item > input");

// Charger l'élément à afficher lorsqu'aucun cours n'est disponible
const NoCourse = document.querySelector('#no_course');

// Récupérer le mot écrit dans la barre de recherche et le tester
searchItem.addEventListener('input', function(){
    let inputsearch = searchItem.value;
    // convertir l'entrée de la barre de recherche en minuscule pour éviter les problèmes de casses
    let inputSearchLC = inputsearch.toLowerCase();

    if(inputSearchLC.length == 0){
        // Afficher de base tous les cours si la barre de recherche est vide
        ficheUIUX.classList.remove('hidden');
        fichePHP.classList.remove('hidden');
        ficheNODE.classList.remove('hidden');
        ficheREACT.classList.remove('hidden');
        ficheMYSQL.classList.remove('hidden');
    }else{
        // Masquer de base tous les cours lorsque la barre de recherche est remplie
        ficheUIUX.classList.add('hidden');
        fichePHP.classList.add('hidden');
        ficheNODE.classList.add('hidden');
        ficheREACT.classList.add('hidden');
        ficheMYSQL.classList.add('hidden');
        showMYSQL = showNODE = showPHP = showREACT = showUIUX = false;
    };

    // Vérifier s'il correspond à PHP
    findWordPHP(inputSearchLC);
    // Vérifier s'il correspond à REACT JS
    findWordREACT(inputSearchLC);
    // Vérifier s'il correspond à NODE JS
    findWordNODE(inputSearchLC);
    // Vérifier s'il correspond à UIUX
    findWordUIUX(inputSearchLC);
    // Vérifier s'il correspond à MYSQL
    findWordMYSQL(inputSearchLC);
    
    // Afficher aucun cours de disponible
    if(showUIUX == false && showPHP == false && showREACT == false && showNODE == false && showMYSQL == false){
        NoCourse.classList.remove('hidden');
    }else{
        NoCourse.classList.add('hidden');
    };
});

// Vérifier si le mot correspond à PHP
function findWordPHP(input){
    const arrayPHP = ['p', 'ph', 'php', 'php8'];
    arrayPHP.forEach(function(word){
        if(word == input){
            fichePHP.classList.remove('hidden');
            showPHP = true;
        };
    });
};

// Vérifier si le mot correspond à REACT JS
function findWordREACT(input){
    const arrayREACT = ['j', 'js', 'r', 're', 'rea', 'reac', 'react','react ', 'react j', 'react js'];
    arrayREACT.forEach(function(word){
        if(word == input){
            ficheREACT.classList.remove('hidden')
            showREACT = true;
        };
    });
};

// Vérifier si le mot correspond à NODE JS
function findWordNODE(input){
    const arrayNODE = ['j', 'js', 'n', 'no', 'nod', 'node', 'node ','node j', 'node js'];
    arrayNODE.forEach(function(word){
        if(word == input){
            ficheNODE.classList.remove('hidden')
            showNODE = true;
        };
    });
};

// Vérifier si le mot correspond à UIUX
function findWordUIUX(input){
    const arrayUIUX = ['u', 'ui', 'ui/', 'ui/u', 'ui/ux'];
    arrayUIUX.forEach(function(word){
        if(word == input){
            ficheUIUX.classList.remove('hidden')
            showUIUX = true;
        };
    });
};

// Vérifier si le mot correspond à MYSQL
function findWordMYSQL(input){
    const arrayMYSQL = ['m', 'my', 'mys', 'mysq', 'mysql'];
    arrayMYSQL.forEach(function(word){
        if(word == input){
            ficheMYSQL.classList.remove('hidden')
            showMYSQL = true;
        };
    });
};