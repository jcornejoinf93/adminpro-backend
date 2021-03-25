const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const validarJWT = (req = request, res = response, next) => {

    // Leer el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existe token'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(uid);
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });

    }

};

const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, consultar con administrador'
        });

    }

};

const validarADMIN_ROLE_o_mismoUsuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, contactar a soporte técnico'
        });

    }

};

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_mismoUsuario
};