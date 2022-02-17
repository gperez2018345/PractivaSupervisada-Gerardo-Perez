const express = require('express');
const asignacionController = require('../controller/asignacion.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/agregarAsignaciones', md_autenticacion.Auth, asignacionController.AsignacionCursos);
api.get('/obtenerAsignaciones', md_autenticacion.Auth, asignacionController.obtenerAsignacionAlumno);

module.exports =api;