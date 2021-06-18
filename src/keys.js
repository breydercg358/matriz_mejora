// Código para crear la conexión con la base de datos en NodeJS. 

// Se exporta el módulo 'database' para su posterior uso en otros archivos del Back-End
module.exports = {
    database: {
        // Nombre del anfitrión. En este caso localhost ejecuta los servicios de manera local
        host: 'localhost',
        // Nombre del usuario en phpMyAdmin
        user: 'root',
        // Contraseña de usuario en phpMyAdmin. DENTRO DEL SVR, LA CONTRASEÑA DEFINIDA ES S0p0rt35
        password: '',
        // Nombre de la DB con la que se hace la conexión
        database: 'database_matriz'
    }
};