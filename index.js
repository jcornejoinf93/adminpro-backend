require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config.ts');

// crear servidor express
const app = express();

// Configurar cors
app.use(cors());

// Base de datos
dbConnection();

app.get('/', (req, resp) => {

    resp.json({
        ok: true,
        msg: 'Hola mundo'
    });

});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});