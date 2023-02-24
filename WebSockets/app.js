const express = require('express');
const app = express();

const http = require('http').Server(app);
// Utilizamos la bilbioteca socket io (instalando la biblioteca con 'npm install socket.io')
const io = require('socket.io')(http);
app.use(express.static('public'));

app.get('/', (req, res) => {

});

// Este método se tiene que dejar en inglés ('connection') | Esto se hace cada vez ue un cliente se conceta con el servidor
io.on('connection', (socket) => {
    console.log('usuari connectat')
    socket.on('disconnect', () => {
        console.log('usuari desconnectat');
    });

    // Esto es lo que enviamos al cliente ('dadesDesDelServidor' es la clave que se envía al cliente)
    socket.emit('dadesDesDelServidor', { dades: 'ABC' });
    socket.on('dadesDesDelClient', function (data) {
        console.log('SERVIDOR -> dades rebudes del client->' + data.dades);
    });
});

http.listen(3000, () => {
    console.log('escoltant en *:3000');
});