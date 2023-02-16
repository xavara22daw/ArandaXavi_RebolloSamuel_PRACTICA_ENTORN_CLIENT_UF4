const contenedorComics = document.getElementById("resultados");
const contenedorPersonajes = document.getElementById("personajes");
const xhr = new XMLHttpRequest();

function cridaRemota(url, method, callback) {
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      callback(data);
    }
  };
  xhr.send();
}

let personatgeEntrada = document.getElementById("entrada").value;

document.getElementById("entrada").onchange = function () {
  cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${this.value}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`, 'GET', function(dades) {
    contenedorPersonajes.innerHTML = "";
    console.table(dades);
    for (let i = 0; i < dades.data.results.length; i++) {
      const personaje = dades.data.results[i].name;
      const nuevoDiv = document.createElement("div");
      nuevoDiv.textContent = personaje;
      contenedorPersonajes.appendChild(nuevoDiv);
    }

    let idCharacter = dades.data.results[0].id;

    cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939&limit=70`, 'GET', function(dades) {
      contenedorComics.innerHTML = "";
      console.log(dades.data.results[0]);

      for (let i = 0; i < dades.data.results.length; i++) {
        const comic = dades.data.results[i];
        const titulo = comic.title;

        const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;

        const nuevoDiv = document.createElement("div");
        contenedorComics.appendChild(nuevoDiv);
        nuevoDiv.classList.add("contenedorComics");
        nuevoDiv.innerHTML = `
          <img src="${thumbnail}"><br>
          <h1>${titulo}</h1><br>
        `;
      }
    });
  });
};