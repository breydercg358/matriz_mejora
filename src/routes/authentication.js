const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});
router.post('/login', isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local.login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next)
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;

// CRUD USUARIOS
/*router.post('/table_usuarios', (req, res) => {
    passport.authenticate('local.table_usuarios', {
        successRedirect: '/table_usuarios',
        failureRedirect: '/table_usuarios',
        failureFlash: true
    });
    res.send('Recibido');
}); */