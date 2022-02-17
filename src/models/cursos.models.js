const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cursoSchema = Schema({
    nombre: String,
    idMaestro:{type:Schema.Types.ObjectId, ref: 'usuarios'}
});

module.exports = mongoose.model('cursos', cursoSchema);