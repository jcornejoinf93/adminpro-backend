const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 5;

    try {

        // const usuariosDB = await Usuario.find({}, 'nombre email role google img')
        //     .skip(desde)
        //     .limit(hasta);

        // const total = await Usuario.count();

        const [usuariosDB, total] = await Promise.all([
            Usuario.find({}, 'nombre email role google img')
            .skip(desde)
            .limit(hasta),
            Usuario.countDocuments()
        ]);

        if (usuariosDB.length === 0) {
            return res.json({
                ok: false,
                msg: 'No existen usuarios en bd'
            });
        }

        res.json({
            ok: true,
            usuariosDB,
            id_user: req.uid,
            total

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, contactarse con adm'
        });

    }

};

const crearUsuario = async(req, resp = response) => {

    const { password, email } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return resp.status(400).json({
                ok: false,
                msg: 'Correo duplicado, intente de nuevo con otra dirección'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        // Generar string aleatorio y definirlo al usuario.password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuarios
        await usuario.save();

        // Para generar el token
        const token = await generarJWT(usuario._id);

        resp.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar los logs'
        });
    }
};

const actualizarUsuario = async(req = request, resp = response) => {
    // TODO: Validar token y confirmar si e usuario tiene privilegios para actualizar

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }

        const { password, google, email, ...campos } = req.body;
        //delete campos.password;
        //delete campos.google;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if (existeEmail) {
                return resp.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }


        if (!usuarioDB.google) {
            campos.email = req.body.email;
        } else if (usuarioDB.email !== email) {
            return resp.status(400).json({
                ok: false,
                msg: 'No es posible editar email de google'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        resp.json({
            ok: true,
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);

        return resp.status(500).json({
            ok: false,
            error: {
                msg: 'Error inesperado, revisar los logs.'
            }
        });

    }
}

const eliminaUsuario = async(req = request, resp = response) => {
    const uid = req.params.id;

    try {
        Usuario.findByIdAndDelete(uid, (err, usuarioBorrado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioBorrado) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'No existe el usuario en BD.'
                });
            }

            resp.json({
                ok: true,
                usuarioBorrado
            });
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Error inesperado en la eliminación, revisar logs'
        });
    }
};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminaUsuario
};