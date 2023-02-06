
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

  document.getElementById("entrada").onchange = function() {
    cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${this.value}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939` )
    .then(dades => {
  
      console.table(dades); 
      document.getElementById("nom").innerHTML = dades.data.results[0].name;

      let idCharacter = dades.data.results[0].id;

      cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`)
    .then(dades => {
      console.log(dades.data.results[0].title);
      document.getElementById("titulo").innerHTML = dades.data.results[0].title;

    })});

  };

  