// Creamos 1 variable las cual igualamos a 1 elemento del DOM
let contenedorComics = document.getElementById("resultados");


// Declaramos la función asíncrona que realizará las peticiones
async function cridaRemota(url = '') {
  // Realizamos el fetch() dentro de la función asíncrona "crida remota"
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', // Como estamos haciendo un GET, lo desactivamos
  });

  return response.json(); // passa de JSON a objecte JS
}

// Cada vez que hay un evento change en el elemento del DOM 'entrada', llamamos a la función asíncrona cridaRemota
document.getElementById("entrada").onchange = function () {
    // Declaramos la variable 'idUndefined' para controlar si la búsqueda da resultados o no
    let idUndefined = false;
    let idCharacter;
    contenedorComics.innerHTML = '';

    cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${this.value}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`)
        .then(dades => {
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
                contenedorComics.innerHTML = `<img src="../public/thor.gif" style="margin-top: 19%; transform: scale(1.4);">`;
                // Hacemos otra llamada a la función "cridaRemota" para encontrar los cómics del personaje
                cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939&limit=84`)
                .then(response => {
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
                            let descripcionInfo = document.createElement('p');
                            let autorInfo = document.create
                            // Asignamos valor a cada uno de los elementos que vamos a 'comicData'
                            tituloInfo.innerHTML = `${titulo}`;
                            portadaInfo.src = portada;
                            descripcionInfo.innerHTML = `<b>Descripción: </b>${resultado.description}`;
                            comicData.append(tituloInfo, portadaInfo, descripcionInfo);

                            /*for (let i = 0; i < dades.data.results.length; i++) {
                                const comic = dades.data.results[i];
                                const titulo = comic.title;
                    
                                const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
                    
                                const nuevoDiv = document.createElement("div");
                                contenedorComics.appendChild(nuevoDiv);
                                nuevoDiv.classList.add("contenedorComics");
                                const divOverlay = document.createElement("div");
                                nuevoDiv.innerHTML = /*`<img src="${thumbnail}"><br><h1>${titulo}</h1><br>`; `<img src="${thumbnail}">`;
                                nuevoDiv.appendChild(divOverlay);
                                divOverlay.classList.add('overlayComics');
                                divOverlay.innerHTML = `<h2>${titulo}</h2>`;
                              }*/
                        }
                    });
                })
            } 
        });
};

