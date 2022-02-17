const express = require('express');
const usuarioController = require('../controller/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/registrarMaestro',usuarioController.registrarMaestro);
api.post('/registrarAlumno',usuarioController.registrarAlumno);
api.post('/login',usuarioController.login);
api.put('/editarAlumno/:idUsuario',md_autenticacion.Auth,usuarioController.editarAlumno);
api.delete('/eliminarAlumno/:idUsuario',md_autenticacion.Auth,usuarioController.eliminarAlumno);

module.exports =api;