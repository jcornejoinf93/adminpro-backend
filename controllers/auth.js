const { response, request } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const usuario = require("../models/usuario");
const { getMenuFrontEnd } = require("../helpers/menu.frontend");

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el email usuario'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Aquí se debe generar token - JWT
        const token = await generarJWT(usuarioDB._id);
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs.'
        });

    }
}

const googleSignIn = async(req = request, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);
        let usuario;

        const usuarioBD = await Usuario.findOne({ email });

        //Si no existe el usuario en nuestra BD
        if (!usuarioBD) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // Existe usuarioen nuestra BD
            usuario = usuarioBD;
            usuario.google = true;
        }

        // Guardar en db
        usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            msg: 'Google sign in',
            token,
            menu: getMenuFrontEnd(usuario.role)

        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });

    }
};

const renewToken = async(req = request, res = response) => {

    const uid = req.uid;

    // Generar token
    const token = await generarJWT(uid);

    // Obtener usuario
    const usuario = await Usuario.findById(uid);
    res.json({
        ok: true,
        msg: 'Nuevo token generado',
        token,
        uid,
        usuario,
        menu: getMenuFrontEnd(usuario.role)

    });
};


module.exports = {
    login,
    googleSignIn,
    renewToken
};