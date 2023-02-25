/* 
    * WebSockets
    * Es demana realitzar una aplicació que permet obtenir informació de l’API de Marvel, https://developer.marvel.com/.
    * @authors 15585039.clot@fje.edu (Samuel Rebollo) | 15585072.clot@fje.edu (Xavier Aranda) 
    * @version 1.0 24.02.23 (data començament)
*/

// Primero de todo, instanciamos los WebSockets
const socket = io();


// Creamos 1 variable la cual igualamos a 1 elemento del DOM
let contenedorComics = document.getElementById("resultados");

// Cada vez que hay un evento change en el elemento del DOM con id 'entrada', envíamos el valor del input (buscador) al servidor mediante WebSockets
document.getElementById('entrada').onchange = function (){
    contenedorComics.innerHTML = `<img src="Doctor-Strange.gif" style="margin-top: 12%; transform: scale(0.6);">`;
    socket.emit('dadesDesDelClient', {
        personaje: this.value
    });
}


// Primer callback del cliente, se queda escuchando para recibir el mensaje con clave 'comicsPersonaje' que enviará el servidor
socket.on('comicsPersonaje', function (data) {
    contenedorComics.innerHTML = ``;
    console.log('CLIENT --> Cómics recibidos desde el servidor: ');
    console.log(data.comics);
    let responseComics = data.comics;

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
        divOverlay.onclick = function () {
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
            if (resultado.description != null && resultado.description != "") {
                descripcionInfo.innerHTML = `<b>Descripción: </b>${resultado.description}`;
            }
            // Variable para acceder fácilmente a los creadores
            let creadores = resultado.creators.items;
            // Trabajamos para guardar el valor del autor y el dibujante de cada cómic
            let autor;
            let dibujante;
            for (let i = 0; i < creadores.length; i++) {
                if (creadores[i].role == "writer") {
                    autor = creadores[i].name;
                } else if (creadores[i].role == "penciler" || creadores[i].role == "penciller" || creadores[i].role == "penciller (cover)" || creadores[i].role == "penciler (cover)") {
                    dibujante = creadores[i].name;
                }
            }

            // Añadimos la información del cómic seleccionado al DOM para que se vea en la página
            comicData.appendChild(tituloInfo);
            comicData.appendChild(divPortadaInfo);
            divPortadaInfo.appendChild(portadaInfo);
            comicData.appendChild(descripcionInfo);
            if (autor != undefined) {
                autorInfo.innerHTML = `<b>Autor:</b> ${autor}`;
                comicData.appendChild(autorInfo);
            }
            if (dibujante != undefined) {
                dibujanteInfo.innerHTML = `<b>Dibujante:</b> ${dibujante}`;
                comicData.appendChild(dibujanteInfo);
            }
            if (resultado.prices[0].price != 0 && resultado.prices[0].price != "") {
                precioInfo.innerHTML = `<b>Precio:</b> ${resultado.prices[0].price}`;
                comicData.appendChild(precioInfo);
            }
        }
    });
});


// Segundo callback del cliente, se queda escuchando para recibir el mensaje con clave 'sinResultados' que enviará el servidor
socket.on('sinResultados', function(data){
    contenedorComics.innerHTML = `<h1 style="margin-top: 21%; color: white;">La búsqueda no ha obtenido resultados.</h1>`;
    console.log("La búsqueda no ha obtenido resultados.");
})