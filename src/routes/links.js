const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const moment = require('moment');
// POOL references the DB connection
const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn, isAdmin, GetUserId } = require('../lib/auth');
const { urlencoded, json } = require('body-parser');
const { query } = require('../database');
const { nextTick } = require('process');
const { updateLocale } = require('moment');
const { cookie } = require('express-validator');
const { equal } = require('assert');
const { userInfo } = require('os');
const { Console } = require('console');
storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/public/img_hallazgos');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({storage});

/*
INDEX
*/
    router.get('/dashboard', isLoggedIn, (req, res) => {
        res.render('matriz/dashboard');
    });

/*
Usuarios
*/
// CREATE
    router.post('/tables/usuarios', isLoggedIn, isAdmin, passport.authenticate('local.table_usuarios', {
        successRedirect: '/tables/usuarios',
        failureRedirect: '/tables/usuarios',
        failureFlash: true,
        session: false
    }));
// READ
    router.get('/tables/usuarios', isLoggedIn, isAdmin, async (req, res) => {
        const usuarios = await pool.query('SELECT * FROM tbl_usuarios');
        res.render('matriz/tables/usuarios', { usuarios });
    });
// DELETE
    router.get('/tables/usuarios/delete/:id', isLoggedIn, isAdmin, GetUserId, async (req, res) => {
        const { id } = req.params;
        if(id == GetUserId){
            req.flash('message', "No puedes eliminar al usuario con el que has iniciado sesión.");
            res.redirect('/tables/usuarios');
        }else{
            await pool.query('DELETE FROM tbl_usuarios WHERE id_usuario = ?', [id]);
            req.flash('user_success', '¡Usuario eliminado con éxito!');
            res.redirect('/tables/usuarios');
        }
    });
// SELECT EDIT
    router.get('/tables/usuarios/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const usuariosEdit = await pool.query('SELECT * FROM tbl_usuarios WHERE id_usuario = ?', [id]);
        res.render('matriz/edit/edit_usuario', { usuariosEdit: usuariosEdit[0] });
    });
// UPDATE
    router.post('/tables/usuarios/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
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
            res.redirect('/tables/usuarios');
    });

/*
Sedes
*/
// CREATE
    router.post('/tables/sedes', isLoggedIn, isAdmin, async(req, res) => {
        const updated_at = new Date();
        const { nombre_sede } = req.body;
        const newSede = {
            nombre_sede,
            updated_at
        };
        const equal_sede = {
            sede: await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE nombre_sede = ?", [nombre_sede])
        };
        if(Object.values(equal_sede.sede).length <= 0){
            await pool.query('INSERT INTO tbl_sedes set ?', [newSede]);
            req.flash('user_success', 'Sede agregada con éxito');
            res.redirect('/tables/sedes');
        }else{
            if(newSede.nombre_sede == Object.values(equal_sede.sede[0])){
                req.flash('message', "La sede '" + Object.values(equal_sede.sede[0]) + "' ya existe dentro de la tabla de sedes.");
                res.redirect('/tables/sedes');
            };
        }

    });
// READ
    router.get('/tables/sedes', isLoggedIn, isAdmin, async (req, res) => {
        const sedes = await pool.query('SELECT * FROM tbl_sedes');
        res.render('matriz/tables/sedes', { sedes });
    });
// DELETE
    router.get('/tables/sedes/delete/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        await pool.query('DELETE FROM tbl_sedes WHERE id_sede = ?', [id]);
        req.flash('user_success', '¡Sede eliminada con éxito!');
        res.redirect('/tables/sedes');
    });
// SELECT EDIT
    router.get('/tables/sedes/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const SedesEdit = await pool.query('SELECT * FROM tbl_sedes WHERE id_sede = ?', [id]);
        res.render('matriz/edit/edit_sede', { SedesEdit: SedesEdit[0] });
    });
// UPDATE
    router.post('/tables/sedes/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_sede } = req.body;
        const newSede = {
            nombre_sede,
            updated_at
        };
        const equal_edit_sede = {
            sede_edit: await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE nombre_sede = ?", [nombre_sede])
        };
        if(Object.values(equal_edit_sede.sede_edit).length <= 0){
            await pool.query('UPDATE tbl_sedes set ? WHERE id_sede = ?', [newSede, id]);
            req.flash('user_success', '¡Sede editada con éxito!');
            res.redirect('/tables/sedes');
        }else{
            if(newSede.nombre_sede == Object.values(equal_edit_sede.sede_edit[0])){
                req.flash('message', "La sede '" + Object.values(equal_edit_sede.sede_edit[0]) + "' ya existe dentro de la tabla de sedes.");
                res.redirect('/tables/sedes/edit/' + [id]);
            }
        }
    });

/* 
Áreas
*/
// CREATE
    router.post('/tables/sedes/areas', isLoggedIn, isAdmin, async(req, res) => {
        var id_sede = req.param('id_sede');
        const updated_at = new Date();
        const { nombre_area } = req.body;
        const newArea = {
            nombre_area,
            updated_at,
        };
        const equal_area = {
            area: await pool.query("SELECT nombre_area FROM tbl_areas WHERE nombre_area = ? AND id_sede = ?", [nombre_area, id_sede]),
            nombre_sede: await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [id_sede]),
            id_sede_equal: await pool.query("SELECT id_sede FROM tbl_sedes WHERE id_sede = ?", [id_sede])
        };
        if(Object.values(equal_area.area).length <= 0){
            const area_insert = await pool.query('INSERT INTO tbl_areas set ?', [newArea]);
            if(area_insert){
                await pool.query('UPDATE tbl_areas SET id_sede = ? ORDER BY created_at desc LIMIT 1', [id_sede]);
                req.flash('user_success', '¡Área agregada con éxito!');
                res.redirect('/tables/sedes/areas?id_sede=' + id_sede);
            }
        }else{
            if(newArea.nombre_area == Object.values(equal_area.area[0]) && id_sede == Object.values(equal_area.id_sede_equal[0])){
                req.flash('message', "El área '" + Object.values(equal_area.area[0]) + "' ya existe dentro de la tabla de áreas de " + Object.values(equal_area.nombre_sede[0]) + ".");
                res.redirect('/tables/sedes/areas?id_sede=' + id_sede);
            }
        }
    });
// READ
    router.get('/tables/sedes/areas', isLoggedIn, isAdmin, async (req, res) => {
        var id_sede = req.param('id_sede');
        const rows = await pool.query('SELECT * FROM tbl_sedes WHERE id_sede = ?', [id_sede]);
        if (rows.length > 0){
            const sedes = rows[0];
            const areas = await pool.query('SELECT * FROM tbl_areas WHERE id_sede = ?', rows[0].id_sede);
            return res.render('matriz/tables/areas', { areas, sedes });
        }
    });
// DELETE
    router.get('/tables/areas/delete/:id/sede', isLoggedIn, isAdmin, async (req, res) => {
        var id_sede = req.param('id_sede');
        const { id } = req.params;
        await pool.query('DELETE FROM tbl_areas WHERE id_area = ?', [id]);
        req.flash('user_success', '¡Área eliminada con éxito!');
        res.redirect('/tables/sedes/areas?id_sede=' + id_sede);
    });
// SELECT EDIT
    router.get('/tables/areas/edit/:id/sede', isLoggedIn, isAdmin, async (req, res) => {
        id_sede = req.param('id_sede');
        const { id } = req.params;
        const AreasEdit = await pool.query('SELECT * FROM tbl_areas WHERE id_area = ?', [id]);
        res.render('matriz/edit/edit_area', { AreasEdit: AreasEdit[0], id_sede });
    });
// UPDATE
    router.post('/tables/areas/edit/:id/sede', isLoggedIn, isAdmin, async (req, res) => {
        var id_sede = req.param('id_sede');
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_area } = req.body;
        const newArea = {
            nombre_area,
            updated_at
        };
        const equal_area_edit = {
            area_edit: await pool.query("SELECT nombre_area FROM tbl_areas WHERE nombre_area = ? AND id_sede = ?", [nombre_area, id_sede]),
            nombre_sede_edit: await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [id_sede]),
            id_sede_equal_edit: await pool.query("SELECT id_sede FROM tbl_sedes WHERE id_sede = ?", [id_sede])
        };
        if(Object.values(equal_area_edit.area_edit).length <= 0){
            await pool.query('UPDATE tbl_areas set ? WHERE id_area = ?', [newArea, id]);
            req.flash('user_success', '¡Área editada con éxito!');
            res.redirect('/tables/sedes/areas?id_sede=' + id_sede);
        }else{
            if(newArea.nombre_area == Object.values(equal_area_edit.area_edit[0]) && id_sede == Object.values(equal_area_edit.id_sede_equal_edit[0])){
                req.flash('message', "El área '" + Object.values(equal_area_edit.area_edit[0]) + "' ya existe dentro de la tabla de áreas de " + Object.values(equal_area_edit.nombre_sede_edit[0]) + ".");
                res.redirect('/tables/areas/edit/' + [id] + '/sede?id_sede=' + id_sede);
            }
        }

    });

/*
Tipos de hallazgo
*/
// CREATE
    router.post('/tables/tipos_hallazgo', isLoggedIn, isAdmin, async(req, res) => {
        const updated_at = new Date();
        const { nombre_tipo } = req.body;
        const newTipo = {
            nombre_tipo,
            updated_at
        };
        const equal_tipo = {
            tipo_hallazgo: await pool.query("SELECT nombre_tipo FROM tbl_tipos_hallazgo WHERE nombre_tipo = ?", [nombre_tipo])
        };
        if(Object.values(equal_tipo.tipo_hallazgo).length <= 0){
            await pool.query('INSERT INTO tbl_tipos_hallazgo set ?', [newTipo]);
            req.flash('user_success', '¡Tipo de hallazgo agregado con éxito!');
            res.redirect('/tables/tipos_hallazgo');
        }else{
            if(newTipo.nombre_tipo == Object.values(equal_tipo.tipo_hallazgo[0])){
                req.flash('message', "El tipo de hallazgo '" + Object.values(equal_tipo.tipo_hallazgo[0]) + "' ya existe dentro de la tabla de tipos de hallazgo.");
                res.redirect('/tables/tipos_hallazgo');
            }
        }
    });
// READ
    router.get('/tables/tipos_hallazgo', isLoggedIn, isAdmin, async (req, res) => {
        tipos = await pool.query("SELECT * FROM tbl_tipos_hallazgo");
        res.render('matriz/tables/tipos_hallazgo', { tipos });
    });
// DELETE
    router.get('/tables/tipos_hallazgo/delete/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        await pool.query('DELETE FROM tbl_tipos_hallazgo WHERE id_tipo = ?', [id]);
        req.flash('user_success', '¡Tipo de hallazgo eliminado con éxito!');
        res.redirect('/tables/tipos_hallazgo');
    });
// SELECT EDIT
    router.get('/tables/tipos_hallazgo/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const TiposEdit = await pool.query("SELECT * FROM tbl_tipos_hallazgo WHERE id_tipo = ?", [id]);
        res.render('matriz/edit/edit_tipo', { TiposEdit: TiposEdit[0] });
    });
// UPDATE
    router.post('/tables/tipos_hallazgo/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_tipo } = req.body;
        const newTipo = {
            nombre_tipo,
            updated_at
        };
        const equal_edit_tipo = {
            tipo_edit: await pool.query("SELECT nombre_tipo FROM tbl_tipos_hallazgo WHERE nombre_tipo = ?", [nombre_tipo])
        };
        if(Object.values(equal_edit_tipo.tipo_edit).length <= 0){
            await pool.query("UPDATE tbl_tipos_hallazgo SET ? WHERE id_tipo = ?", [newTipo, id]);
            req.flash('user_success', '¡Tipo de hallazgo editado con éxito!');
            res.redirect('/tables/tipos_hallazgo');
        }else{
            if(newTipo.nombre_tipo == Object.values(equal_edit_tipo.tipo_edit[0])){
                req.flash('message', "El tipo de hallazgo '" + Object.values(equal_edit_tipo.tipo_edit[0]) + "' ya existe dentro de la tabla de tipos de hallazgo.");
                res.redirect('/tables/tipos_hallazgo/edit/' + [id]);
            }
        }
    }); 

/*
Fuentes
*/
// CREATE
    router.post('/tables/fuentes', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { nombre_fuente } = req.body;
        const newFuente = {
            nombre_fuente,
            updated_at
        };
        const equal_fuente = {
            fuente: await pool.query("SELECT nombre_fuente FROM tbl_fuentes WHERE nombre_fuente = ?", [nombre_fuente])
        };
        if(Object.values(equal_fuente.fuente).length <= 0){
            await pool.query("INSERT INTO tbl_fuentes SET ?", [newFuente]);
            req.flash('user_success', '¡Fuente agregada con éxito!');
            res.redirect('/tables/fuentes');
        }else{
            if(newFuente.nombre_fuente == Object.values(equal_fuente.fuente[0])){
                req.flash('message', "La fuente '" + Object.values(equal_fuente.fuente[0]) + "' ya existe dentro de la tabla de fuentes.");
                res.redirect('/tables/fuentes');
            }
        }
    });
// READ
    router.get('/tables/fuentes', isLoggedIn, isAdmin, async (req, res) => {
        const fuentes = await pool.query("SELECT * FROM tbl_fuentes");
        res.render('matriz/tables/fuentes', { fuentes });
    });
// DELETE
    router.get('/tables/fuentes/delete/:id', isLoggedIn, isAdmin, async(req, res) => {
        const { id } = req.params;
        await pool.query('DELETE FROM tbl_fuentes WHERE id_fuente = ?', [id]);
        req.flash('user_success', '¡Fuente eliminada con éxito');
        res.redirect('/tables/fuentes');
    });
// SELECT EDIT
    router.get('/tables/fuentes/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const FuentesEdit = await pool.query("SELECT * FROM tbl_fuentes WHERE id_fuente = ?", [id]);
        res.render('matriz/edit/edit_fuente', { FuentesEdit: FuentesEdit[0] });
    });
// UPDATE
    router.post('/tables/fuentes/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_fuente } = req.body;
        const newFuente = {
            nombre_fuente,
            updated_at
        };
        const equal_edit_fuente = {
            fuente_edit: await pool.query("SELECT nombre_fuente FROM tbl_fuentes WHERE nombre_fuente = ?", [nombre_fuente])
        };
        if(Object.values(equal_edit_fuente.fuente_edit).length <= 0){
            await pool.query("UPDATE tbl_fuentes SET ? WHERE id_fuente = ?", [newFuente, id]);
            req.flash('user_success', '¡Fuente editada con éxito!');
            res.redirect('/tables/fuentes');
        }else{
            if(newFuente.nombre_fuente == Object.values(equal_edit_fuente.fuente_edit[0])){
                req.flash('message', "La fuente de hallazgo '" + Object.values(equal_edit_fuente.fuente_edit[0]) + "' ya existe dentro de la tabla de fuentes.");
                res.redirect('/tables/fuentes/edit/' + [id]);
            }
        }
    });

/*
Factores de riesgo
*/
// CREATE
    router.post('/tables/factores', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { nombre_factor } = req.body;
        const newFactor = {
            nombre_factor,
            updated_at
        };
        const equal_factor = {
            factor: await pool.query("SELECT nombre_factor FROM tbl_factores WHERE nombre_factor = ?", [nombre_factor])
        };
        if(Object.values(equal_factor.factor).length <= 0){
            await pool.query('INSERT INTO tbl_factores SET ?', [newFactor]);
            req.flash('user_success', '¡Factor de riesgo agregado con éxito!');
            res.redirect('/tables/factores');
        }else{
            if(newFactor.nombre_factor == Object.values(equal_factor.factor[0])){
                req.flash('message', "El factor de riesgo '" + Object.values(equal_factor.factor[0]) + "' ya existe dentro de la tabla de factores de riesgo.");
                res.redirect('/tables/factores');
            }
        }
    });        
// READ
    router.get('/tables/factores', isLoggedIn, isAdmin, async (req, res) => {
        const factores = await pool.query('SELECT * FROM tbl_factores');
        res.render('matriz/tables/factores', { factores });
    });
// DELETE
    router.get('/tables/factores/delete/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        await pool.query("DELETE FROM tbl_factores WHERE id_factor = ?", [id]);
        req.flash('user_success', '¡Factor de riesgo eliminado con éxito!');
        res.redirect('/tables/factores');
    });
// SELECT EDIT
    router.get('/tables/factores/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const FactoresEdit = await pool.query("SELECT * FROM tbl_factores WHERE id_factor = ?", [id]);
        res.render('matriz/edit/edit_factor', { FactoresEdit: FactoresEdit[0] });
    });
// UPDATE
    router.post('/tables/factores/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { id } = req.params; 
        const { nombre_factor } = req.body;
        const newFactor = {
            nombre_factor,
            updated_at
        };
        const equal_factor_edit = {
            factor_edit: await pool.query("SELECT nombre_factor FROM tbl_factores WHERE nombre_factor = ?", [nombre_factor])
        };
        if(Object.values(equal_factor_edit.factor_edit).length <= 0){
            await pool.query("UPDATE tbl_factores SET ? WHERE id_factor = ?", [newFactor, id]);
            req.flash('user_success', '¡Factor de riesgo editado con éxito');
            res.redirect('/tables/factores');
        }else{
            if(newFactor.nombre_factor == Object.values(equal_factor_edit.factor_edit[0])){
                req.flash('message', "El factor de riesgo '" + Object.values(equal_factor_edit.factor_edit[0]) + "' ya existe dentro de la tabla de factores de riesgo.");
                res.redirect('/tables/factores/edit/' + [id]);
            }
        }
    });


/*
Prioridades
*/
// CREATE
    router.post('/tables/prioridades', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { nombre_prioridad } = req.body;
        const newPrioridad = {
            nombre_prioridad,
            updated_at
        };
        const equal_prioridad = {
            prioridad: await pool.query("SELECT nombre_prioridad FROM tbl_prioridades WHERE nombre_prioridad = ?", [nombre_prioridad])
        };
        if(Object.values(equal_prioridad.prioridad).length <= 0){
            await pool.query("INSERT INTO tbl_prioridades SET ?", [newPrioridad]);
            req.flash('user_success', '¡Prioridad agregada con éxito!');
            res.redirect('/tables/prioridades');
        }else{
            if(newPrioridad.nombre_prioridad == Object.values(equal_prioridad.prioridad[0])){
                req.flash('message', "La prioridad '" + Object.values(equal_prioridad.prioridad[0]) + "' ya existe dentro de la tabla de prioridades.");
                res.redirect('/tables/prioridades');
            }
        }
    });
// READ
    router.get('/tables/prioridades', isLoggedIn, isAdmin, async (req, res) => {
        const prioridades = await pool.query("SELECT * FROM tbl_prioridades");
        res.render('matriz/tables/prioridades', { prioridades });
    });
// DELETE
    router.get('/tables/prioridades/delete/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        await pool.query("DELETE FROM tbl_prioridades WHERE id_prioridad = ?", [id]);
        req.flash('user_success', '¡Prioridad eliminada con éxito!');
        res.redirect('/tables/prioridades');
    });
// SELECT EDIT
    router.get('/tables/prioridades/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const PrioridadesEdit = await pool.query('SELECT * FROM tbl_prioridades WHERE id_prioridad = ?', [id]);
        res.render('matriz/edit/edit_prioridad', { PrioridadesEdit: PrioridadesEdit[0] });
    });
// UPDATE
    router.post('/tables/prioridades/edit/:id', isLoggedIn, isAdmin, async (req, res) => {    
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_prioridad } = req.body;
        const newPrioridad = {
            nombre_prioridad,
            updated_at
        };
        const equal_prioridad_edit = {
            prioridad_edit: await pool.query("SELECT nombre_prioridad FROM tbl_prioridades WHERE nombre_prioridad = ?", [nombre_prioridad])
        };
        if(Object.values(equal_prioridad_edit.prioridad_edit).length <= 0){
            await pool.query("UPDATE tbl_prioridades SET ? WHERE id_prioridad = ?", [newPrioridad, id]);
            req.flash('user_success', '¡Prioridad editada con éxito!');
            res.redirect('/tables/prioridades');
        }else{
            if(newPrioridad.nombre_prioridad == Object.values(equal_prioridad_edit.prioridad_edit[0])){
                req.flash('message', "La prioridad '" + Object.values(equal_prioridad_edit.prioridad_edit[0]) + "' ya existe dentro de la tabla de prioridades.");
                res.redirect('/tables/prioridades/edit/' + [id]);
            }
        }
    });

/* 
Estados
*/
// CREATE
    router.post('/tables/estados', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { nombre_estado, color_estado } = req.body;
        const newEstado = {
            nombre_estado,
            color_estado,
            updated_at
        };
        const equal_estado = {
            estado: await pool.query("SELECT nombre_estado FROM tbl_estados WHERE nombre_estado = ?", [nombre_estado])
        };
        if(Object.values(equal_estado.estado).length <= 0){
            await pool.query("INSERT INTO tbl_estados SET ?", [newEstado]);
            req.flash('user_success', '¡Estado agregado con éxito');
            res.redirect('/tables/estados');
        }else{
            if(newEstado.nombre_estado == Object.values(equal_estado.estado[0])){
                req.flash('message', "El estado '" + Object.values(equal_estado.estado[0]) + "' ya existe dentro de la tabla de estados.");
                res.redirect('/tables/estados');
            }
        }
    });
// READ
    router.get('/tables/estados', isLoggedIn, isAdmin, async (req, res) => {
        const estados = await pool.query('SELECT * FROM tbl_estados');
        res.render('matriz/tables/estados', { estados });
    });
// DELETE
    router.get('/tables/estados/delete/:id', isLoggedIn, isAdmin, async(req, res) => {
        const { id } = req.params;
        await pool.query("DELETE FROM tbl_estados WHERE id_estado = ?", [id]);
        req.flash('user_success', '¡Estado eliminado con éxito!');
        res.redirect('/tables/estados');
    });
// SELECT EDIT
    router.get('/tables/estados/edit/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        const EstadosEdit = await pool.query("SELECT * FROM tbl_estados WHERE id_estado = ?", [id]);
        res.render('matriz/edit/edit_estado', { EstadosEdit: EstadosEdit[0] });
    });
// UPDATE
    router.post('/tables/estados/edit/:id', isLoggedIn, isAdmin, async(req, res) => {
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_estado, color_estado } = req.body;
        const newEstado = {
            nombre_estado,
            color_estado,
            updated_at
        };
        const equal_estado_edit = {
            estado_edit: await pool.query("SELECT nombre_estado FROM tbl_estados WHERE nombre_estado = ? AND color_estado = ?", [nombre_estado, color_estado])
        };
        if(Object.values(equal_estado_edit.estado_edit).length <= 0){
            await pool.query("UPDATE tbl_estados SET ? WHERE id_estado = ?", [newEstado, id]);
            req.flash('user_success', '¡Estado editado con éxito!');
            res.redirect('/tables/estados');
        }else{
            if(newEstado.nombre_estado == Object.values(equal_estado_edit.estado_edit[0])){
                req.flash('message', "El estado '" + Object.values(equal_estado_edit.estado_edit[0]) + "' ya existe dentro de la tabla de estados.");
                res.redirect('/tables/estados/edit/' + [id]);
            }
        }
    });

/*
Responsables
*/
// CREATE
    router.post('/tables/responsables', isLoggedIn, isAdmin, async (req, res) => {
        const updated_at = new Date();
        const { nombre_responsable } = req.body;
        const NewResponsable = {
            nombre_responsable,
            updated_at
        };
        const equal_responsable = {
            responsable: await pool.query("SELECT nombre_responsable FROM tbl_responsables WHERE nombre_responsable = ?", [nombre_responsable])
        };
        if(Object.values(equal_responsable.responsable).length <= 0){
            await pool.query("INSERT INTO tbl_responsables SET ?", [NewResponsable]);
            req.flash('user_success', "¡Responsable agregado con éxito!");
            res.redirect('/tables/responsables');
        }else{
            if(NewResponsable.nombre_responsable == Object.values(equal_responsable.responsable[0])){
                req.flash('message', "El responsable '" + Object.values(equal_responsable.responsable[0]) + "' ya existe dentro de la tabla de responsables.");
                res.redirect('/tables/responsables');
            }
        }
    });
// READ
    router.get('/tables/responsables', isLoggedIn, isAdmin, async (req, res) => {
        const responsables = await pool.query("SELECT * FROM tbl_responsables");
        res.render('matriz/tables/responsables', { responsables });
    });
// SELECT EDIT
    router.get('/tables/responsables/edit/:id', isLoggedIn, isAdmin, async(req, res) => {
        const { id } = req.params;
        const ResponsablesEdit = await pool.query("SELECT * FROM tbl_responsables WHERE id_responsable = ?", [id]);
        res.render('matriz/edit/edit_responsable', { ResponsablesEdit: ResponsablesEdit[0] })
    });
// UPDATE
    router.post('/tables/responsables/edit/:id', isLoggedIn, isAdmin, async(req, res) => {
        const updated_at = new Date();
        const { id } = req.params;
        const { nombre_responsable } = req.body;
        const NewResponsable = {
            nombre_responsable,
            updated_at
        };
        const equal_responsable_edit = {
            responsable_edit: await pool.query("SELECT nombre_responsable FROM tbl_responsables WHERE nombre_responsable = ?", [nombre_responsable])
        };
        if(Object.values(equal_responsable_edit.responsable_edit).length <= 0){
            await pool.query("UPDATE tbl_responsables SET ? WHERE id_responsable = ?", [NewResponsable, id]);
            req.flash('user_success', "¡Responsable editado con éxito!");
            res.redirect('/tables/responsables');
        }else{
            if(NewResponsable.nombre_responsable == Object.values(equal_responsable_edit.responsable_edit[0])){
                req.flash('message', "El responsable '" + Object.values(equal_responsable_edit.responsable_edit[0]) + "' ya existe dentro de la tabla de responsables.");
                res.redirect('/tables/responsables/edit/' + [id]);
            }
        }
    });
// DELETE
    router.get('/tables/responsables/delete/:id', isLoggedIn, isAdmin, async (req, res) => {
        const { id } = req.params;
        await pool.query("DELETE FROM tbl_responsables WHERE id_responsable = ?", [id]);
        req.flash('user_success', "¡Responsable eliminado con éxito!");
        res.redirect('/tables/responsables');

    });

/*
Cambios de estado
*/
// READ
    router.get('/tables/cambio_estado', isLoggedIn, isAdmin, async (req, res) => {
        const cambio_estado = await pool.query("SELECT * FROM tbl_historial_estado");
        res.render('matriz/tables/cambio_estado', { cambio_estado });
    });
// READ (BASIC USER)
    router.get('/tables/cambio_estado/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const cambio_estado = await pool.query("SELECT * FROM tbl_historial_estado WHERE id_usuario = ?", [id]);
        res.render('matriz/tables/cambio_estado', { cambio_estado });
    });
// GET CAMBIAR ESTADO DE HALLAZGO
    router.get('/tables/hallazgos/form_cambio_estado/:id', isLoggedIn, async(req, res) => {
        const { id } = req.params;
        const estados = await pool.query("SELECT * FROM tbl_estados");
        const HallazgoCambio = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_hallazgo = ?", [id]);
        console.log(estados);
        console.log(HallazgoCambio[0]);
        res.render('matriz/forms/form_cambio_estado', { HallazgoCambio: HallazgoCambio[0], estados });
    });
// POST CAMBIAR ESTADO DE HALLAZGO
    router.post('/tables/hallazgos/form_cambio_estado', upload.array('registro_fotografico_cambio', 5), isLoggedIn, async (req, res) => {
        const id_hallazgo = req.param('id_hallazgo');
        const id_usuario = req.param('usuario');
        const GetRolUsuario = {
            id_usuario: await pool.query("SELECT rol FROM tbl_usuarios WHERE id_usuario = ?", [id_usuario])
        };
        const ArrayGetRolUsuario = Object.values(GetRolUsuario.id_usuario[0]);
        const { nombre_hallazgo, nuevo_estado, razon_cambio, fecha_final } = req.body;
        const NewCambioEstado = {
            nombre_hallazgo,
            nuevo_estado,
            razon_cambio,
        };
        const FechaFinalEstado = {
            fecha_final
        };
        const InsertCambioEstado = await pool.query("INSERT INTO tbl_historial_estado SET ?", [NewCambioEstado]);
        await pool.query("UPDATE tbl_hallazgos SET estado = ? WHERE id_hallazgo = ?", [nuevo_estado, id_hallazgo]);
        req.flash('user_success', "¡Estado cambiado con éxito!");
        if(ArrayGetRolUsuario == 'Administrador'){
            res.redirect('/tables/hallazgos');
        }else if(ArrayGetRolUsuario == 'Estándar'){
            res.redirect('/tables/hallazgos/' + [id_usuario]);
        }
        if(InsertCambioEstado){
            await pool.query("UPDATE tbl_historial_estado SET id_usuario = ? WHERE fecha_cambio = NOW()", [id_usuario]);
            await pool.query("UPDATE tbl_hallazgos SET fecha_final = ? WHERE id_hallazgo = ?", [FechaFinalEstado.fecha_final, id_hallazgo]);
            const registro_fotografico_cambio = req.files.map(file => file.filename);
            const registro_foto_cambio = Object.entries(registro_fotografico_cambio).map(([key, value]) => ['', value]);
            await pool.query("INSERT INTO tbl_img_estado (id_img_estado, nombre_img_estado) VALUES ?", [registro_foto_cambio]);
            const cambio_estado = {
                id_cambio_estado: await pool.query("SELECT id_cambio_estado FROM tbl_historial_estado ORDER BY id_cambio_estado DESC LIMIT 1")
            };
            const get_id_cambio_estado = Object.values(cambio_estado.id_cambio_estado[0]); 
            await pool.query("UPDATE tbl_img_estado SET id_cambio_estado = ? WHERE uploaded_at = NOW()", [get_id_cambio_estado,     id_usuario]);
            console.log(id_usuario);
        }
    });
// GET IMAGENES DE CAMBIO DE ESTADO
    router.get('/cambio_estado/registro_fotografico', isLoggedIn, async(req, res) => {
        id_cambio_estado = req.param('id');
        const registro_foto_cambio = await pool.query("SELECT * FROM tbl_img_estado WHERE id_cambio_estado = ?", [id_cambio_estado]);
        res.render('matriz/forms/cambio_registro_fotografico', { registro_foto_cambio });
    });
// POST IMAGES - CAMBIO DE ESTADO
    router.post('/cambio_estado/registro_fotografico', upload.array('new_registro_fotografico_cambio', 4), isLoggedIn, async (req, res ) => {
        const id_cambio_estado = req.param('id_cambio_estado');
        const count_images_cambio = {
            n_img_cambio: await pool.query("SELECT * FROM tbl_img_estado WHERE id_cambio_estado = ?", [id_cambio_estado])
        };
        const ArrayLongitudCambio = Object.entries(count_images_cambio.n_img_cambio);
        if(ArrayLongitudCambio.length >= 5){
            req.flash('message', "No puedes agregar más imagenes a este cambio de estado");
            res.redirect('/cambio_estado/registro_fotografico?id=' + [id_cambio_estado]);
        }else{
            const NewRegistroFotograficoCambio = req.files.map(file => file.filename);
            const NewArrayFotoCambio = Object.entries(NewRegistroFotograficoCambio).map(([key, value]) => ['', value]);
            const InsertNewFotoCambio = await pool.query("INSERT INTO tbl_img_estado (id_img_estado, nombre_img_estado) VALUES ?", [NewArrayFotoCambio]);
            req.flash('user_success', '¡Adición realizada con éxito!');
            res.redirect('/cambio_estado/registro_fotografico?id=' + [id_cambio_estado]);
            if(InsertNewFotoCambio){
                await pool.query("UPDATE tbl_img_estado SET id_cambio_estado = ? WHERE uploaded_at = NOW()", [id_cambio_estado]);
            }
        }
    });
// DELETE SINGLE IMAGE - CAMBIO DE ESTADO
    router.get('/cambio_estado/deleteImgCambio', isLoggedIn, async (req, res) => {
        const id_img_estado = req.param('id_img_estado');
        const id_cambio_estado = req.param('id_cambio_estado');
        CountLastImgCambio = await pool.query("SELECT * FROM tbl_img_estado WHERE id_cambio_estado = ?", [id_cambio_estado]);
        if(CountLastImgCambio.length <= 1){
            req.flash('message', 'No puedes eliminar la última imagen de este cambio de estado');
            res.redirect('/cambio_estado/registro_fotografico?id=' + [id_cambio_estado]);
        }else{
            const query_id_cambio_estado = {
                id_cambio_estado: await pool.query("SELECT id_cambio_estado FROM tbl_img_estado WHERE id_img_estado = ?",   [id_img_estado])
            };
            const value_id_cambio_estado = Object.values(query_id_cambio_estado.id_cambio_estado[0]);
            const query_img_estado = {
                nombre_img_estado: await pool.query("SELECT nombre_img_estado FROM tbl_img_estado WHERE id_img_estado = ?", [id_img_estado])
            };
            const value_nombre_img_estado = Object.values(query_img_estado.nombre_img_estado[0]);
            const path_single_image_cambio = './src/public/img_hallazgos/' + value_nombre_img_estado;
        try{
                fs.unlinkSync(path_single_image_cambio);
            } catch(err){
                console.log(err);
            }
            await pool.query("DELETE FROM tbl_img_estado WHERE id_img_estado = ?", [id_img_estado]);
            req.flash('user_success', '¡Registro eliminado con éxito!');
            res.redirect('/cambio_estado/registro_fotografico?id=' + [id_cambio_estado]);
        }
    });

/*
Hallazgos
*/
// READ    
    router.get('/tables/hallazgos', isLoggedIn, async (req, res) => {
        const CounterTotalHallazgos = await pool.query("SELECT * FROM tbl_hallazgos");
        const VarTotalHallazgos = CounterTotalHallazgos.length;
        const hallazgos = await pool.query("SELECT * FROM tbl_hallazgos");
        const estados = await pool.query("SELECT * FROM tbl_estados");
        const responsables = await pool.query("SELECT * FROM tbl_responsables");
        res.render('matriz/tables/hallazgos', { hallazgos, estados, responsables, VarTotalHallazgos });
    });

// READ TABLE HALLAZGOS (BASIC USER)
    router.get('/tables/hallazgos/:id', isLoggedIn, async (req, res) => { 
            const { id } = req.params;
            const responsables = await pool.query("SELECT * FROM tbl_responsables");
            const CounterHallazgosUser = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_usuario = ?", [id]);
            VarHallazgosUser = CounterHallazgosUser.length;
            const hallazgos = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_usuario = ?", [id]);
            res.render('matriz/tables/hallazgos', { hallazgos, responsables, VarHallazgosUser });
    });

// READ TABLE HALLAZGOS (RESPONSABLE)
    router.get('/hallazgos/responsable', isLoggedIn, async (req, res) => {
        const id_responsable = req.param('id');
        const responsables = await pool.query("SELECT * FROM tbl_responsables");
        const SelectNombreResponsable = {
            nombre_responsable: await pool.query("SELECT nombre_responsable FROM tbl_responsables WHERE id_responsable = ?", [id_responsable])
        };
        const ArrayNombreResponsable = Object.values(SelectNombreResponsable.nombre_responsable[0]);
        const ReplaceNombreResponsable = JSON.stringify(ArrayNombreResponsable).replace(/['"[\]]+/g, '');
        const LikeReplaceResponsable = '%' + ReplaceNombreResponsable + '%';
        const hallazgos = await pool.query("SELECT * FROM tbl_hallazgos WHERE responsable LIKE ?", [LikeReplaceResponsable]);
        res.render('matriz/tables/hallazgos', { hallazgos, responsables });
    });

// READ TABLE HALLAZGOS (SINGLE USER)
    router.get('/tables/hallazgosUser/usuario', isLoggedIn, isAdmin, async (req, res) => {
        const id_usuario = req.param('id');
        const usuario = await pool.query("SELECT nombre_usuario, nombre_persona FROM tbl_usuarios WHERE id_usuario = ?", [id_usuario]);
        const SelectHallazgosUsuario = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_usuario = ?", [id_usuario]);
        res.render('matriz/tables/hallazgosUser', { SelectHallazgosUsuario, usuario: usuario[0] });
    });

// READ IMAGES
    router.get('/hallazgos/registro_fotografico', isLoggedIn, async (req,res) => {
        id_hallazgo = req.param('id');
        await pool.query("SELECT * FROM tbl_hallazgos WHERE id_hallazgo = ?", [id_hallazgo]);
        const registro_foto = await pool.query("SELECT * FROM tbl_images WHERE id_hallazgo = ?", [id_hallazgo]);
        res.render('matriz/forms/registro_fotografico', { registro_foto });
    });

// POST IMAGES
    router.post('/hallazgos/add/registro_fotografico', upload.array('new_registro_fotografico', 9), isLoggedIn, async (req,res) => {
        const id_hallazgo = req.param('id');
        const count_images = {
            n_img: await pool.query("SELECT * FROM tbl_images WHERE id_hallazgo = ?", [id_hallazgo])
        };
        const ArrayContarLongitud = Object.entries(count_images.n_img);
        console.log(ArrayContarLongitud);
        if(ArrayContarLongitud.length >= 10){
            req.flash('message', "No puedes agregar más imagenes a este hallazgo");
            res.redirect('/hallazgos/registro_fotografico?id=' + [id_hallazgo]);
        }else{
            const NewRegistroFotografico = req.files.map(file => file.filename);
            const NewArrayFoto = Object.entries(NewRegistroFotografico).map(([key, value]) => ['', value]);
            const InsertNewFoto = await pool.query("INSERT INTO tbl_images (id_imagen, nombre_img) VALUES ?", [NewArrayFoto]);
            req.flash('user_success', "¡Adición realizada con éxito!");
            res.redirect('/hallazgos/registro_fotografico?id=' + [id_hallazgo]);
            if(InsertNewFoto){
                await pool.query("UPDATE tbl_images SET id_hallazgo = ? WHERE uploaded_at = NOW()", [id_hallazgo]);
            }
        }
    });

// SELECT EDIT
    router.get('/tables/hallazgos/edit/:id', isLoggedIn, async (req, res) => {
        const sedes = await pool.query("SELECT * FROM tbl_sedes");
        const areas = await pool.query("SELECT * FROM tbl_areas");
        const responsables = await pool.query("SELECT * FROM tbl_responsables");
        const tipos = await pool.query("SELECT * FROM tbl_tipos_hallazgo");
        const fuentes = await pool.query("SELECT * FROM tbl_fuentes");
        const factores = await pool.query("SELECT * FROM tbl_factores");
        const prioridades = await pool.query("SELECT * FROM tbl_prioridades");
        const estados = await pool.query("SELECT * FROM tbl_estados");
        const { id } = req.params;
        const HallazgosEdit = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_hallazgo = ?", [id]);
        res.render('matriz/edit/edit_hallazgo', { HallazgosEdit: HallazgosEdit[0], responsables, sedes, areas, tipos, fuentes, factores, prioridades, estados });
    });

// UPDATE
    router.post('/tables/hallazgos/edit/:id', isLoggedIn, async (req,res) => {
        for(var responsable in req.body.responsable){
            if(req.body.responsable){
                items = req.body.responsable;
                responsable = JSON.stringify(items).replace(/]|[[]|"/g, ' ',)
            }
        }
        const { id } = req.params;
        const { nombre_hallazgo, fecha, sede, area, descripcion, tipo_hallazgo, fuente, factor_riesgo, prioridad, plan_sugerido, fecha_ejecucion, otras_observaciones } = req.body;
        const NewHallazgo = {
            nombre_hallazgo,
            fecha,
            sede,
            area,
            responsable: responsable,
            descripcion,
            tipo_hallazgo,
            fuente,
            factor_riesgo,
            prioridad,
            plan_sugerido,
            fecha_ejecucion,
            otras_observaciones
        };
        await pool.query("UPDATE tbl_hallazgos SET ? WHERE id_hallazgo = ?", [NewHallazgo, id]);
        req.flash('user_success', "¡Hallazgo editado con éxito!");
        res.redirect('/tables/hallazgos');
    });

// DELETE
    router.get('/tables/hallazgos/delete/:id/user', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const id_usuario = req.param('idUser');
        const nombre_img = "SELECT nombre_img FROM tbl_images WHERE id_hallazgo = ?";
        pool.query(nombre_img, [id], function (err, rows){
            if(err) throw err;
            for(var i = 0; i < rows.length; i++){
                var result = rows[i];
                const RealPath_img = './src/public/img_hallazgos/' + result.nombre_img;
                try{
                    fs.unlinkSync(RealPath_img)
                } catch(err){
                    console.error(err)
                }
                console.log(result);
            }
        });
        const DeleteHallazgo = await pool.query("DELETE FROM tbl_hallazgos WHERE id_hallazgo = ?", [id]);
        if(DeleteHallazgo){
            const CounterHallazgosUser = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_usuario = ?", [id_usuario]);
            await pool.query("UPDATE tbl_usuarios SET planes_creados = ? WHERE id_usuario = ?", [CounterHallazgosUser.length, id_usuario]);
        }
        req.flash('user_success', "¡Hallazgo eliminado con éxito!");
        res.redirect('/tables/hallazgos');
    });

// DELETE SINGLE IMAGE
    router.get('/hallazgos/deleteImg', isLoggedIn, async (req, res) => {
        const id_imagen = req.param('id_imagen');
        const id_hallazgo = req.param('id_hallazgo');
        const CountLastImg = await pool.query("SELECT * FROM tbl_images WHERE id_hallazgo = ?", [id_hallazgo]);
        if(CountLastImg.length <= 1){
            req.flash('message', "No puedes eliminar la última imagen perteneciente a este hallazgo.");
            res.redirect('/hallazgos/registro_fotografico?id=' + [id_hallazgo]);
        }else{
            const query_id_hallazgo = {
                id_hallazgo: await pool.query("SELECT id_hallazgo FROM tbl_images WHERE id_imagen = ?", [id_imagen])
            };
            const value_id_hallazgo = Object.values(query_id_hallazgo.id_hallazgo[0])
            const query_img = {
                nombre_img: await pool.query("SELECT nombre_img FROM tbl_images WHERE id_imagen = ?", [id_imagen])
            };
            const value_nombre_img = Object.values(query_img.nombre_img[0]);
            console.log(query_img.nombre_img[0]);
            const path_single_image = './src/public/img_hallazgos/' + value_nombre_img;
            try{
                fs.unlinkSync(path_single_image);
            } catch(err){
                console.error(err);
            }
            await pool.query("DELETE FROM tbl_images WHERE id_imagen = ?", [id_imagen]);
            req.flash('user_success', "¡Registro fotográfico eliminado con éxito!");
            res.redirect('/hallazgos/registro_fotografico?id=' + value_id_hallazgo);
        }

    });
        
/*
Form Hallazgos
*/
// READ APP TABLES
    router.get('/forms/form_hallazgos', isLoggedIn, async (req, res) =>{
        const sedes = await pool.query("SELECT * FROM tbl_sedes");
        const areas = await pool.query("SELECT * FROM tbl_areas");
        const usuarios = await pool.query("SELECT id_usuario, nombre_usuario FROM tbl_usuarios");
        const responsables = await pool.query("SELECT * FROM tbl_responsables");
        const tipos = await pool.query("SELECT * FROM tbl_tipos_hallazgo");
        const fuentes = await pool.query("SELECT * FROM tbl_fuentes");
        const factores = await pool.query("SELECT * FROM tbl_factores");
        const prioridades = await pool.query("SELECT * FROM tbl_prioridades");
        const estados = await pool.query("SELECT * FROM tbl_estados");    
        res.render('matriz/forms/form_hallazgos', { usuarios, responsables, sedes, areas, tipos, fuentes, factores, prioridades, estados });
    });

// CREATE FORM
    router.post('/forms/form_hallazgos/:id', upload.array('registro_fotografico', 10), isLoggedIn, async (req, res) => {

        const { id } = req.params;
        const GetRolUsuario = {
            id_usuario: await pool.query("SELECT rol FROM tbl_usuarios WHERE id_usuario = ?", [id])
        };
        const ArrayGetRolUsuario = Object.values(GetRolUsuario.id_usuario[0]);

        for(var responsable in req.body.responsable){
            if(req.body.responsable){
                items = req.body.responsable;
                responsable = JSON.stringify(items).replace(/]|[[]|"/g, ' ',)
            }
        }
        const { nombre_hallazgo, nombre_persona, nombre_usuario, fecha, sede, area, lugar_hallazgo, descripcion, tipo_hallazgo, fuente, factor_riesgo, prioridad, estado, plan_sugerido, fecha_ejecucion, otras_observaciones, id_usuario } = req.body;
        const NewHallazgo = {
            nombre_hallazgo,
            nombre_persona,
            nombre_usuario,
            fecha,
            fecha_ejecucion,
            sede,
            area,
            lugar_hallazgo,
            responsable: responsable,
            descripcion,
            tipo_hallazgo,
            fuente,
            factor_riesgo,
            prioridad,
            estado,
            plan_sugerido,
            otras_observaciones,
            id_usuario
        };
        const HallazgoInsert = await pool.query("INSERT INTO tbl_hallazgos SET ?", [NewHallazgo]);
        const registro_fotografico = req.files.map(file => file.filename);
        const registro_foto = Object.entries(registro_fotografico).map(([key, value]) => ['', value]);
        await pool.query("INSERT INTO tbl_images (id_imagen, nombre_img) VALUES ?", [registro_foto]);
        req.flash('user_success', "¡El hallazgo ha sido agregado con éxito!");
        if(ArrayGetRolUsuario == 'Administrador'){
            res.redirect('/tables/hallazgos');
        }else if(ArrayGetRolUsuario == 'Estándar'){
            res.redirect('/tables/hallazgos/' + [id]);
        }
        // UPDATE id_sede TO nombre_sede
            const select_sede = {
                sede: await pool.query("SELECT sede FROM tbl_hallazgos ORDER BY id_hallazgo DESC LIMIT 1")
            };
            const get_select_sede = Object.values(select_sede.sede[0]);
            const get_n_sede = {
                nombre_sede: await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [get_select_sede])
            };
            const get_nombre_sede = Object.values(get_n_sede.nombre_sede[0]);
            await pool.query("UPDATE tbl_hallazgos SET sede = ? ORDER BY id_hallazgo DESC LIMIT 1", [get_nombre_sede]);
        // UPDATE tbl_images
            if(HallazgoInsert){
                const count_hallazgos = await pool.query("SELECT * FROM tbl_hallazgos WHERE id_usuario = ?", [NewHallazgo.id_usuario]);
                await pool.query("UPDATE tbl_usuarios SET planes_creados = ? WHERE id_usuario = ?", [count_hallazgos.length, NewHallazgo.id_usuario]);
                const hallazgo = {
                    id_hallazgo: await pool.query("SELECT id_hallazgo FROM tbl_hallazgos ORDER BY id_hallazgo DESC LIMIT 1")
                };
                const get_id_hallazgo = Object.values(hallazgo.id_hallazgo[0]);
                const registro = "UPDATE tbl_images SET id_hallazgo = ? WHERE uploaded_at = NOW()";
                await pool.query(registro, [get_id_hallazgo], function(err) {
                    if(err) throw err;
                });
            }
    });

/*
Gráficas
*/
// Tabla de indicadores
router.get('/dashboard/charts/TablaIndicadores', isLoggedIn, async (req, res) => {
    const DataSedes = await pool.query("SELECT * FROM tbl_sedes");
    const TotalAreas = await pool.query("SELECT COUNT(*) FROM tbl_areas");
    const TotalHallazgos = await pool.query("SELECT COUNT(*) FROM tbl_hallazgos");
    var StringTotalHallazgos = Object.values(TotalHallazgos[0]);
    var StringTotalAreas = Object.values(TotalAreas[0]);
    res.render('matriz/tabla_indicadores', { DataSedes, StringTotalHallazgos, StringTotalAreas });
});
// Planes por área
router.get('/dashboard/charts/PlanesArea', isLoggedIn, async (req, res) => {
    const sedes = await pool.query("SELECT * FROM tbl_sedes");
    const DataSedesId = await pool.query("SELECT id_sede FROM tbl_sedes");
    const DataSedesNombres = await pool.query("SELECT nombre_sede FROM tbl_sedes");
    const NombresAreas = await pool.query("SELECT nombre_area FROM tbl_areas"); 

    async function getAllAreas(DataSedesId, DataSedesNombres){
        var NumTotalHallazgosAreas = [];

        /*for(var i in DataSedesId){
            const ArrayNombresAreas = Object.values(DataSedesId[i]);
            const QuerySelectNombresAreas = await pool.query("SELECT nombre_area FROM tbl_areas WHERE id_sede = ?", [ArrayNombresAreas]);
            NombresAreas.push(QuerySelectNombresAreas);
        }*/


        for(var i = 0; i < NombresAreas.length; i++){
            const ArraySedes = Object.values(DataSedesNombres[i]);
            const ArrayAreas = Object.values(NombresAreas[i]);
            console.log(ArrayAreas);
            const QuerySelectAreas = await pool.query("SELECT COUNT(id_hallazgo) FROM tbl_hallazgos WHERE sede = ? AND area = ?", [ArraySedes, ArrayAreas]);
            console.log(QuerySelectAreas);
        }
        console.log(NumTotalHallazgosAreas);
    }
    getAllAreas(DataSedesId, DataSedesNombres);
    res.render('matriz/planes_area', { sedes });
});
// Planes por factor de riesgo
router.get('/dashboard/charts/PlanesFR', isLoggedIn, async(req, res) => {
    res.render('matriz/planes_fr');
});
// Planes por mes
router.get('/dashboard/charts/PlanesMes', isLoggedIn, async(req, res) => {
    res.render('matriz/planes_mes');
});
// Planes por prioridad
router.get('/dashboard/charts/PlanesPrioridad', isLoggedIn, async(req, res) => {
    res.render('matriz/planes_prioridad');
});
// Estado de los planes
router.get('/dashboard/charts/EstadoPlan', isLoggedIn, async(req, res) => {
    
    res.render('matriz/estado_plan');
});

module.exports = router;