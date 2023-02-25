/* 
    * WebSockets
    * Es demana realitzar una aplicació que permet obtenir informació de l’API de Marvel, https://developer.marvel.com/.
    * @authors 15585039.clot@fje.edu (Samuel Rebollo) | 15585072.clot@fje.edu (Xavier Aranda) 
    * @version 1.0 24.02.23 (data començament)
*/

// Creamos nuestro servidor con 'Express'
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // Utilizamos la bilbioteca socket.io (previamente hay que instalar la biblioteca "npm install socket.io")
app.use(express.static('public'));


// Al acceder a la raíz de nuestro servidor, mostramos nuestra página principal "index.html"
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Declaramos la función asíncrona que realizará las peticiones con Fetch
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


// Cada vez que el usuario se conecta al servidor y establece conexión con el socket, mostramos por el terminal que el usuario se ha conectado
io.on('connection', (socket) => {
    console.log('El usuario se ha conectado.')

    // Si el usuario se desconecta, mostramos por el terminal que el usuario se ha desconectado
    socket.on('disconnect', () => {
        console.log('El usuario se ha desconectado.');
    });
    
    // Cuando el servidor recibe el mensaje del cliente con clave 'dadesDesDelClient', realiza las siguientes acciones
    socket.on('dadesDesDelClient', function (data) {
        console.log("\nSERVIDOR --> Personaje recibido del cliente para buscar: " + data.personaje);
        let personaje = data.personaje;
        // Declaramos la variable 'idUndefined' para controlar si la búsqueda da resultados o no
        let idUndefined = false;
        let idCharacter;
        cridaRemota(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${personaje}&ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939`)
        .then(dades => {
            console.log(`Buscando cómics del personaje '${personaje}' ...`);
            // Asignamos a la variable 'idCharacter' el valor del id el primer personaje encontrado en la búsqueda
            if (dades.data.results[0] == undefined) {
                idUndefined = true;
            } else {
                idCharacter = dades.data.results[0].id;
            }

            // Comprobamos si hemos obtenido resultados en la búsqueda del personaje o no
            if (idUndefined == true) {
                console.log("La búsqueda no ha obtenido resultados.");
                // En caso de no encontrar ningún personaje con el nombre que ha recibido el servidor, le enviamos un mensaje con WebSocket al cliente indicando que no se han encontrado resultados
                socket.emit('sinResultados', {
                    dades: 'La búsqueda no ha obtenido resultados.'
                })
            } else {
                // Hacemos otra llamada a la función "cridaRemota" para encontrar los cómics del personaje
                cridaRemota(`https://gateway.marvel.com:443/v1/public/characters/${idCharacter}/comics?ts=1&apikey=3c043a9e457ce749d34745ac17502e1f&hash=197925ff06c90e7929be51c9028a1939&limit=84`)
                    .then(response => {
                        console.log(`Enviando los cómics encontrados del personaje '${personaje}' al cliente ...`);
                        comicsEncontrados = response.data.results;

                        // Una vez ya tenemos recopilados todos los cómics del personaje, se los enviamos al cliente mediante un mensaje de WebSockets
                        socket.emit('comicsPersonaje', {
                            comics: comicsEncontrados
                        })
                    })
            }
        });
    });
});


// El servidor escucha por el puerto 3000
http.listen(3000, () => {
    console.log('Servidor iniciat, escoltant pel port :3000');
});