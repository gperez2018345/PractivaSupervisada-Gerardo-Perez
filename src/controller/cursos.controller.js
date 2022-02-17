// importaciones
const express = require('express');
const Cursos = require('../models/cursos.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function obtenerCursos(req,res){


    Cursos.findById((err, cursosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})

        for(let i = 0; i<cursosObtenidos.length; i++){
            console.log(cursosObtenidos[i].nombre)
        }

        return res.send({cursos: cursosObtenidos})
    })
}

function agregarCursosMaestro(req, res){
    var parametros = req.body;
    var cursoModelo = new Cursos();

    if(parametros.nombre){
        cursoModelo.nombre = parametros.nombre;
        cursoModelo.idMaestro = req.user.sub;
    }else{
        return res.status(500).send({message:"error"})
    }

    if (req.user.rol == "ROL_MAESTRO"){
        Cursos.find({nombre:parametros.nombre, idMaestro:req.user.sub},(err,cursosGuardados)=>{
            if (cursosGuardados.length == 0){
                cursoModelo.save((err, cursoGuardado)=>{
                    console.log(err)
                    if (err) return res.status(500).send({message:"error en la peticion"});
                    if(!cursoGuardado) return res.status(404).send({message:"No se puede agregar curso"});
                    return res.status(200).send({curso: cursoGuardado});
        
                })
            }else{
                return res.status(500).send({message:"Este curso ya existe"});
            }
        }).populate('idMaestro', 'nombre')

    }else{
        return res.status(500).send({message:"Sin permisos"});
    }
        

}

function editarCursosMaestro(req, res){
    var idCur = req.params.idCurso;
    var paramentros = req.body;

    if(req.user.rol == "ROL_MAESTRO"){
        Cursos.findOneAndUpdate({_id: idCur, idMaestro: req.user.sub}, paramentros,{new:true},
            (err, cursoEditado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!cursoEditado) return res.status(400).send({mensaje: 'No se puede editar curso'});
                return res.status(200).send({cursos: cursoEditado});
            })
    } else {
        return res.status(500).send({mensaje: 'Sin permisos'});
    }
}


function eliminarCursosMaestro(req, res){
    var idCur = req.params.idCurso;

    if(req.user.rol == "ROL_MAESTRO"){
        Cursos.findOneAndDelete({_id: idCur, idMaestro: req.user.sub},(err, cursoEliminado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!cursoEliminado) return res.status(400).send({mensaje: 'No se pudo eliminar el curso'});

                return res.status(200).send({cursos: cursoEliminado});
            })
    } else {
        return res.status(500).send({mensaje: 'Sin permisos'});
    }
}

module.exports = {
    obtenerCursos,
    agregarCursosMaestro,
    editarCursosMaestro,
    eliminarCursosMaestro

}