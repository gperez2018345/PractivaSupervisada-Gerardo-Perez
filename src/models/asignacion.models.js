const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var asignacionSchema = Schema({
    idCurso:{type:Schema.Types.ObjectId, ref:'usuarios'},
    idAlumno:{type:Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('asignacion', asignacionSchema);