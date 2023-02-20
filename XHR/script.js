/* 
    * XHR
    * Es demana realitzar una aplicació que permet obtenir informació de l’API de Marvel, https://developer.marvel.com/.
    * @authors 15585039.clot@fje.edu (Samuel Rebollo) | 15585072.clot@fje.edu (Xavier Aranda) 
    * @version 1.0 09.02.23 (data començament)
*/

// Creamos 2 variables las cuales igualamos a 2 elementos del DOM
let contenedorComics = document.getElementById("resultados");
let contenedorLogo = document.getElementById("contenedorLogo");

// Creamos un función llamada "carregarLogo", la cual hace una petición para cargar la imagen del logo de la web
function carregarLogo(){
    let xhr = new XMLHttpRequest();
    // Hacemos la petición para bajarnos la imagen del logo de Marvel y situarla como logo (trabajamos con datos binarios)
    xhr.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/2560px-Marvel_Logo.svg.png', true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
        if (this.status == 200) {
            let blob = this.response;
            let img = document.createElement('img');
            let URL = window.URL || window.webkitURL;
            img.src = URL.createObjectURL(blob);
            contenedorLogo.appendChild(img);
        };
    };
    xhr.send(null);
}

// Definimos la función "cridaRemota" con la que haremos la peticiones
function cridaRemota(url, metodo, callback) {
    let xhr = new XMLHttpRequest(); 
    xhr.open(metodo, url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let dades = JSON.parse(xhr.responseText);
            callback(dades);
        }
    };
    xhr.send(null);
}

// Creamos la función inici que se iniciará cuando todo haya cargado
function inici(){
    // Llamamos a la función "carregarLogo" para que se cargue el logo de Marvel nada más iniciar la web
    carregarLogo();
    // Cada vez que hay un evento change en el elemento del DOM 'entrada', realizamos la peticion para obtener los cómics del personaje
    document.getElementById("entrada").onchange = function () {
        let idUndefined = false;
        let idCharacter;
        contenedorComics.innerHTML = '';
        // Llamamos a la función para encontrar el ID del personaje que hemos indicado en el buscador
        cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${this.value}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`, 'GET', function(dades){
            console.table(dades.data.results);
            // Asignamos a la variable 'idCharacter' el valor del id el primer personaje encontrado en la búsqueda
            if (dades.data.results[0] == undefined){
                idUndefined = true;
            }else {
                idCharacter = dades.data.results[0].id;
            }

            // Comprobamos si hemos obtenido resultados en la búsqueda del personaje o no
            if (idUndefined == true){
                console.log("La búsqueda no ha obtenido resultados.");
                contenedorComics.innerHTML = `<h1 style="margin-top: 21%; color: white;">La búsqueda no ha obtenido resultados.</h1>`;
            }else {
                // Si hemos obtenido resultados en la búsqueda del personaje, seguimos con el proceso
                contenedorComics.innerHTML = `<img src="../public/Doctor-Strange.gif" style="margin-top: 12%; transform: scale(0.6);">`;
                // Hacemos otra llamada a la función "cridaRemota" para encontrar los cómics del personaje que hemos buscado
                cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939&limit=84`, 'GET', function(response){
                    contenedorComics.innerHTML = "";
                    console.log("Cómics encontrados del personaje: ");
                    console.log(response.data.results);
                    responseComics = response.data.results;

                    // Recorremos la variable responseComics con un forEach. Esta variable tiene los resultados obtenidos
                    responseComics.forEach(resultado => {
                        let titulo = resultado.title;
                        let portada = `${resultado.thumbnail.path}.${resultado.thumbnail.extension}`;
                        // Creamos elementos div en el DOM los cuales tendrán las portadas de los cómics (le asignamos una clase)
                        let divPortadas = document.createElement("div");
                        contenedorComics.appendChild(divPortadas);
                        divPortadas.classList.add("contenedorComics");
                        let divOverlay = document.createElement("div");
                        // Añadimos a los div con clase "contenedorComics" las imágenes de las portadas de los cómics
                        divPortadas.innerHTML = `<img src="${portada}">`;
                        // Creamos elementos div que irán dentro de los div que tienen la clase "contenedorComics"
                        divPortadas.appendChild(divOverlay) 
                        divOverlay.classList.add('overlayComics');
                        divOverlay.innerHTML = `<h2>${titulo}</h2>`;
                        divOverlay.setAttribute("id", "informacioComic");

                        // Cada vez que hagamos click en la portada de un cómic, mostraremos en la derecha la información de ese cómic
                        divOverlay.onclick = function (){
                            // Definimos variables con valores de elementos del DOM ya existentes o que serán añadidos posteriormente
                            let comicData = document.getElementById('comicData');
                            // Eliminamos todos los elementos hijos de 'comicData' con este bucle
                            while (comicData.firstChild) {
                                comicData.removeChild(comicData.firstChild);
                            }
                            let tituloInfo = document.createElement('h3');
                            let portadaInfo = document.createElement('img');
                            let divPortadaInfo = document.createElement('div');
                            divPortadaInfo.classList.add('divPortadaInfo');
                            let descripcionInfo = document.createElement('p');
                            let autorInfo = document.createElement('p');
                            let dibujanteInfo = document.createElement('p');
                            let precioInfo = document.createElement('p');
                            // Asignamos valor a cada uno de los elementos que vamos a 'comicData'
                            tituloInfo.innerHTML = `${titulo}`;
                            portadaInfo.src = portada;
                            if (resultado.description != null && resultado.description != ""){
                                descripcionInfo.innerHTML = `<b>Descripción: </b>${resultado.description}`;
                            }
                            // Variable para acceder fácilmente a los creadores
                            let creadores = resultado.creators.items;
                            // Trabajamos para guardar el valor del autor y el dibujante de cada cómic
                            let autor;
                            let dibujante;
                            for (let i = 0; i < creadores.length; i++){
                                if (creadores[i].role == "writer"){
                                    autor = creadores[i].name;
                                }else if (creadores[i].role == "penciler" || creadores[i].role == "penciller" || creadores[i].role == "penciller (cover)" || creadores[i].role == "penciler (cover)") {
                                    dibujante = creadores[i].name;
                                }
                            }

                            // Añadimos la información del cómic seleccionado al DOM para que se vea en la página
                            comicData.appendChild(tituloInfo);
                            comicData.appendChild(divPortadaInfo);
                            divPortadaInfo.appendChild(portadaInfo);
                            comicData.appendChild(descripcionInfo);
                            if (autor != undefined){
                                autorInfo.innerHTML = `<b>Autor:</b> ${autor}`;
                                comicData.appendChild(autorInfo);
                            }
                            if (dibujante != undefined){
                                dibujanteInfo.innerHTML = `<b>Dibujante:</b> ${dibujante}`;
                                comicData.appendChild(dibujanteInfo); 
                            }
                            if (resultado.prices[0].price != 0 && resultado.prices[0].price != ""){
                                precioInfo.innerHTML = `<b>Precio:</b> ${resultado.prices[0].price}`;
                                comicData.appendChild(precioInfo);
                            }
                        }
                    })
                })
            }
        })
    }
}

window.addEventListener("load", inici, true);