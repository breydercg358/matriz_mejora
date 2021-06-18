const express = require('express');

const router = express.Router();

const passport = require('passport');

// Módulos de autenticación para verificar si el usuario se encuentra o no logueado
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Redirección al módulo de login en caso de que el usuario no se encuentre logueado
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});


// Código para redireccionar al usuario al módulo principal de la aplicación en caso de estar ya logueado. En caso de querer volver al login, tendrá que cerrar sesión obligatoriamente
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next)
});

// Código para permitir el cierre de sesión del usuario
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;