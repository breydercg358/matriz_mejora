const express = require('express');
const router = express.Router();

// Redirección al módulo de login en caso de no estar logueado
router.get('/', (req, res) =>{
    res.redirect('/login');
});

module.exports = router;