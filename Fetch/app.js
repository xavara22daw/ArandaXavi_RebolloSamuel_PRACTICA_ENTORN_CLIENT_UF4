const contenedorComics = document.getElementById("resultados");
const contenedorPersonajes = document.getElementById("personajes");

async function cridaRemota(url = '', cos = {}) {
  // Les opciones per defecte estan marcades amb *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //si fem un GET cal desactivar-ho
    //body: JSON.stringify(data) // ha de coincidir amb la capçalera "Content-Type" 

  });
  return response.json(); // passa de JSON a objecte JS
}

let personatgeEntrada = document.getElementById("entrada").value;

document.getElementById("entrada").onchange = function () {
  cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${this.value}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`)
    .then(dades => {
      contenedorPersonajes.innerHTML = "";
      console.table(dades);
      for (let i = 0; i < dades.data.results.length; i++) {
        const personaje = dades.data.results[i].name;
        const nuevoDiv = document.createElement("div");
        nuevoDiv.textContent = personaje;
        contenedorPersonajes.appendChild(nuevoDiv);
      }
      //document.getElementById("nom").innerHTML = dades.data.results[0].name;

      let idCharacter = dades.data.results[0].id;

      cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939&limit=70`)
        .then(dades => {
          contenedorComics.innerHTML = "";
          console.log(dades.data.results[0]);

          /*const descripcion = comic.description;
          const creators = comic.creators.items;
          const creador1 = creators[0].name;
          const role1 = creators[0].role;

          console.log(titulo);
          console.log(descripcion);
          console.log(thumbnail);
          console.log(creador1);
          console.log(role1);*/


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
        })
    });

};

