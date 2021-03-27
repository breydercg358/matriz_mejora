const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'nombre_usuario',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM tbl_usuarios WHERE nombre_usuario = ?', [username]);
    if (rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword){
            await pool.query('UPDATE tbl_usuarios SET ultimo_login = NOW() WHERE nombre_usuario = ?', [username]);
            console.log(user.rol);
            console.log(user.id_usuario);
            done(null, user);
        } else {
            done(null, false, req.flash('message', 'La contraseña ingresada no es válida. Por favor inténtalo de nuevo.'));
        }
    }else {
        return done(null, false, req.flash('message', 'El nombre de usuario "' + [username] + '" no existe dentro de la aplicación.'));
    }
}));

passport.use('local.table_usuarios', new LocalStrategy({
    usernameField: 'nombre_usuario',
    passwordField: 'password',
    passReqToCallback: true,
    session: false
}, async (req, nombre_usuario, password, done) => {
    const updated_at = new Date();
    const { nombre_persona, rol } = req.body;
    const newUser = {
        nombre_persona,
        nombre_usuario,
        rol,
        updated_at,
        password
    };
    const equal_usuario = {
        usuario: await pool.query("SELECT nombre_usuario FROM tbl_usuarios WHERE nombre_usuario = ?", [nombre_usuario])
    };
    if(Object.values(equal_usuario.usuario).length <= 0){
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO tbl_usuarios SET ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser, req.flash('user_success', '¡Usuario agregado con éxito!'));
    }else{
        if(newUser.nombre_usuario == Object.values(equal_usuario.usuario[0])){
            return done(null, false, req.flash('message', "El nombre de usuario '" + Object.values(equal_usuario.usuario[0]) + "' ya existe dentro de la aplicación."));
        }
    }

}));

passport.serializeUser(function(user, done){
    done(null, user.id_usuario);
});

passport.deserializeUser(function(id, done){
    pool.query("SELECT * FROM tbl_usuarios WHERE id_usuario = ?", [id], function (err, rows){
        done(err, rows[0]);
    });
});