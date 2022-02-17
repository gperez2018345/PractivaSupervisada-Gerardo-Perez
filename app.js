//importar producto
const express = require('express');
const cors = require('cors');

var app = express();

// importaciones rutas 
const UsuarioRutas = require('./src/routes/usuarios.route');
const CursoRutas = require('./src/routes/cursos.route');
const AsignacionRutas = require('./src/routes/asignacion.route');

//middelwares producto
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabeceras
app.use(cors());

//carga de rutas
app.use('/api',UsuarioRutas, CursoRutas, AsignacionRutas);

module.exports = app;