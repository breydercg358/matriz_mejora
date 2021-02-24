const express = require('express');
const router = express.Router();
const passport = require('passport');
// POOL references the DB connection
const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn } = require('../lib/auth');
const { urlencoded } = require('body-parser');

        // INDEX
router.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('matriz/dashboard');
});

        // Usuarios
// CREATE
router.post('/table_usuarios', passport.authenticate('local.table_usuarios', {
    successRedirect: '/table_usuarios',
    failureRedirect: '/table_usuarios',
    failureFlash: true,
    session: false
}));
// READ
router.get('/table_usuarios', isLoggedIn, async (req, res) => {
    const usuarios = await pool.query('SELECT * FROM tbl_usuarios');
    res.render('matriz/table_usuarios', { usuarios });
});
// DELETE
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tbl_usuarios WHERE id_usuario = ?', [id]);
    req.flash('user_success', '¡Usuario eliminado con éxito!');
    res.redirect('/table_usuarios');
});
// SELECT EDIT
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usuariosEdit = await pool.query('SELECT * FROM tbl_usuarios WHERE id_usuario = ?', [id]);
    res.render('matriz/edit_usuario', { usuariosEdit: usuariosEdit[0] });
});
// UPDATE
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const updated_at = new Date();
    const { id } = req.params;
    const { nombre_persona, nombre_usuario, rol, password } = req.body;
    const newUser = {
        nombre_persona,
        nombre_usuario,
        rol,
        updated_at,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    await pool.query('UPDATE tbl_usuarios set ? WHERE id_usuario = ?', [newUser, id]);
    req.flash('user_success', '¡Usuario editado con éxito!');
    res.redirect('/table_usuarios');
});

        // Sedes
// CREATE
router.post('/table_sedes', isLoggedIn, async(req, res) => {
    const updated_at = new Date();
    const { nombre_sede } = req.body;
    const newSede = {
        nombre_sede,
        updated_at
    };
    await pool.query('INSERT INTO tbl_sedes set ?', [newSede]);
    req.flash('user_success', 'Sede agregada con éxito');
    res.redirect('/table_sedes');
});
// READ
router.get('/table_sedes', isLoggedIn, async (req, res) => {
    const sedes = await pool.query('SELECT * FROM tbl_sedes');
    res.render('matriz/table_sedes', { sedes });
});
// DELETE
router.get('/delete_sede/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tbl_sedes WHERE id_sede = ?', [id]);
    req.flash('user_success', '¡Sede eliminada con éxito!');
    res.redirect('/table_sedes');
});
// SELECT EDIT
router.get('/edit_sede/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const SedesEdit = await pool.query('SELECT * FROM tbl_sedes WHERE id_sede = ?', [id]);
    res.render('matriz/edit_sede', { SedesEdit: SedesEdit[0] });
});
// UPDATE
router.post('/edit_sede/:id', isLoggedIn, async (req, res) => {
    const updated_at = new Date();
    const { id } = req.params;
    const { nombre_sede } = req.body;
    const newSede = {
        nombre_sede,
        updated_at
    };
    await pool.query('UPDATE tbl_sedes set ? WHERE id_sede = ?', [newSede, id]);
    req.flash('user_success', '¡Sede editada con éxito!');
    res.redirect('/table_sedes');
});

        // Áreas
// CREATE
router.post('/table_areas/areas', isLoggedIn, async(req, res) => {
    var id_sede = req.param('id_sede');
    const updated_at = new Date();
    const { nombre_area } = req.body;
    const newArea = {
        nombre_area,
        updated_at,
    };
    await pool.query('INSERT INTO tbl_areas set ?', [newArea]);
    if(newArea){
        await pool.query('UPDATE tbl_areas SET id_sede = ? ORDER BY created_at desc LIMIT 1', [id_sede]);
        req.flash('user_success', 'Área agregada con éxito');
        res.redirect('/table_areas/areas?id_sede=' + id_sede);
    }
});
// READ
router.get('/table_areas/areas', isLoggedIn, async (req, res) => {
    var id_sede = req.param('id_sede');
    const rows = await pool.query('SELECT * FROM tbl_sedes WHERE id_sede = ?', [id_sede]);
    if (rows.length > 0){
        const sedes = rows[0];
        const areas = await pool.query('SELECT * FROM tbl_areas WHERE id_sede = ?', rows[0].id_sede);
        return res.render('matriz/table_areas', { areas, sedes });
    }
});
// DELETE
router.get('/delete_area/:id/areas', isLoggedIn, async (req, res) => {
    var id_sede = req.param('id_sede');
    const { id } = req.params;
    await pool.query('DELETE FROM tbl_areas WHERE id_area = ?', [id]);
    req.flash('user_success', '¡Área eliminada con éxito!');
    res.redirect('/table_areas/areas?id_sede=' + id_sede);
});
// SELECT EDIT
router.get('/edit_area/:id/areas', isLoggedIn, async (req, res) => {
    id_sede = req.param('id_sede');
    const { id } = req.params;
    const AreasEdit = await pool.query('SELECT * FROM tbl_areas WHERE id_area = ?', [id]);
    res.render('matriz/edit_area', { AreasEdit: AreasEdit[0], id_sede });
});
// UPDATE
router.post('/edit_area/:id/areas', isLoggedIn, async (req, res) => {
    var id_sede = req.param('id_sede');
    const updated_at = new Date();
    const { id } = req.params;
    const { nombre_area } = req.body;
    const newArea = {
        nombre_area,
        updated_at
    };
    await pool.query('UPDATE tbl_areas set ? WHERE id_area = ?', [newArea, id]);
    req.flash('user_success', '¡Área editada con éxito!');
    res.redirect('/table_areas/areas?id_sede=' + id_sede);
});

        // Hallazgos
router.get('/table_hallazgos', (req, res) => {
    res.render('matriz/table_hallazgos');
});

        // Form Hallazgos
router.get('/form_hallazgos', (req, res) =>{
    res.render('matriz/form_hallazgos');
});

        // Tipos de hallazgo
router.get('/table_tipos', (req, res) => {
    res.render('matriz/table_tipos');
});

        // Fuentes
router.get('/table_fuentes', (req, res) => {
    res.render('matriz/table_fuentes');
});

        // Factores de riesgo
router.get('/table_factores', (req, res) => {
    res.render('matriz/table_factores');
});

        // Prioridades
router.get('/table_prioridades', (req, res) => {
    res.render('matriz/table_prioridades');
});

        // Estados
router.get('/table_estados', (req, res) => {
    res.render('matriz/table_estados');
});

        // Responsables
router.get('/table_responsables', (req, res) => {
    res.render('matriz/table_responsables');
});

module.exports = router;