// Llamada de MySQL para consultas a la BD
const mysql = require('mysql');

const { promisify } = require('util');

// Llamada al módulo 'database del archivo 'keys.js'
const { database } = require('./keys');

const pool = mysql.createPool(database);

// Mensajes de error en caso de que la conexión con la BD falle.
pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexión con la base de datos fue cerrada.');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene muchas conexiones.')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('La conexión a la base de datos fue rechazada');
        }
    }
    // Mensaje de confirmación de que la conexión a la BD funciona correctamente.
    if(connection) connection.release();
    console.log('La base de datos está conectada');
    return;
});

// pool.query permitirá que las consultas a la base de datos estén disponibles en NodeJS
pool.query = promisify(pool.query);

// Se exporta el módulo 'pool' para su posterior uso en otros archivos del Back-End
module.exports = pool;