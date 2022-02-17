// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function registrarMaestro(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuarios();

    if (parametros.email) {
        usuarioModelo.nombres = 'MAESTRO';
        usuarioModelo.email = parametros.email;
        usuarioModelo.rol = 'ROL_MAESTRO';
    }
    Usuarios.find({ email: parametros.email }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                    if (err) return res.status(500).send({ message: "error en la peticion" });
                    if (!usuarioGuardado) return res.status(404).send({ message: "Error, no se agrego el usuario" });
                    return res.status(201).send({ usuario: usuarioGuardado });
                })
            })

        } else {
            return res.status(500).
                send({ message: "esta usando el mismo correo" });
        }
    })
}

function registrarAlumno(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if (parametros.nombre && parametros.email && parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.email = parametros.email;
        usuarioModel.rol = 'ROL_ALUMNO';

        Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar usuario' });
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });

                });


            } else {
                return res.status(500).send({ mensaje: 'Este correo ya se encuentra utilizado' })
            }
        })
    }
}

function login(req, res) {
    var parametros = req.body;
    Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: "error en la peticion" });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {

                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }


                } else {
                    return res.status(500).send({ mensaje: 'las contraseñas no coinciden' });
                }
            })

        } else {
            return res.status(404).send({ message: "Error, correo no registrado" })
        }
    })
}

function editarAlumno(req, res) {
    var idUser = req.params.idUsuario;
    var parameters = req.body;

    if (idUser == req.user.sub) {
        Usuarios.findByIdAndUpdate(req.user.sub, parameters, { new: true }, (err, alumnoEditado) => {
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!alumnoEditado) return res.status(404).send({ message: "no se puede editar usuario" });

            return res.status(200).send({ usuario: alumnoEditado });
        })

    } else {
        return res.status(500).send({ message: "ID incorrecta, coloque su ID" })
    }
}

function eliminarAlumno(req, res) {
    var idUser = req.params.idUsuario
    var parameters = req.body
    
    if (idUser == req.user.sub) {
        Usuarios.findByIdAndDelete(req.user.sub, parameters, (err, usuarioEliminado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!usuarioEliminado) return res.status(404).send({ message: "Error, al eliminar  el Usuario" });

            return res.status(200).send({ usuario: usuarioEliminado })
        })
    } else{
        return res.status(500).send({ message: "Sin autorización, no se pueden eliminar usuarios que no sean propios" })
    }
}

module.exports = {
    registrarMaestro,
    registrarAlumno,
    login,
    editarAlumno,
    eliminarAlumno
}