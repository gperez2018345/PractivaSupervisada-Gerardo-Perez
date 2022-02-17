// importaciones
const express = require('express');
const Asignacion = require('../models/asignacion.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function AsignacionCursos(req, res){
    var parametros = req.body;
    var asignacionModelo = new Asignacion();

    Asignacion.find({ idAlumno: req.user.sub}, (err, asignacionCurso)=>{
        if(asignacionCurso.length == 3){
            return res.status(500).send({mensaje: "No puede agregarse a mas de 3 cursos"});
        }else{
            Asignacion.find({idCurso: parametros.idCurso, idAlumno: req.user.sub},(err, asignacionesCursos) => {
                if(asignacionesCursos.length == 0){
                    if(parametros.idCurso){
                        asignacionModelo.idAlumno = req.user.sub;
                        asignacionModelo.idCurso = parametros.idCurso;

                        asignacionModelo.save((err, asignacionGuardada) =>{
                            if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                            if (!asignacionGuardada) return res.status(404).send({mensaje:"No se puede asignar a ningun curso"});

                            return res.status(200).send({asignacion: asignacionGuardada});
                        })
                    }
                }else{
                    return res.status(500).send({mensaje:"Ya cuenta con una asignacion en este curso"});
                }
            }).populate('idAlumno','nombre')
        }
    })
}

function obtenerAsignacionAlumno(req, res) {
    Asignacion.find({idAlumno:req.user.sub}, (err, asignacionObtenida) => {
        if (err) return res.status(500).send({mensaje:"Error en la peticion"});
        if (!asignacionObtenida) return res.status(404).send({mensaje: "No se pueden encontrar las asignaciones"});

        return res.status(200).send({asignaciones: asignacionObtenida});
    })
}

module.exports = {
    AsignacionCursos,
    obtenerAsignacionAlumno
}