const express = require('express');
const cursosController = require('../controller/cursos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.get('/obtenerCursos',cursosController.obtenerCursos);
api.post('/agregarCursoMaestro',md_autenticacion.Auth,cursosController.agregarCursosMaestro);
api.put('/editarCursoMaestro/:idCurso',md_autenticacion.Auth,cursosController.editarCursosMaestro);
api.delete('/eliminarCursosMaestro/:idCurso',md_autenticacion.Auth,cursosController.eliminarCursosMaestro);

module.exports =api;