const { request, response } = require("express");
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

getTodo = async(req = request, res = response) => {
    const busqueda = req.params.busqueda;
    const regExp = new RegExp(busqueda, 'i');

    try {

        //const usuariosDB = await Usuario.find({ nombre: regExp });
        //const medicosDB = await Medico.find({ nombre: regExp });
        //const hospitalesDB = await Hospital.find({ nombre: regExp });

        const [usuariosDB, medicosDB, hospitalesDB] = await Promise.all([
            Usuario.find({ nombre: regExp }),
            Medico.find({ nombre: regExp }),
            Hospital.find({ nombre: regExp })
        ]);

        if (usuariosDB.length === 0 && medicosDB.length === 0 && hospitalesDB.length === 0) {
            return res.json({
                ok: true,
                busqueda,
                usuariosDB: 'No existe data en bd',
                medicosDB: 'No existe data en bd',
                hospitalesDB: 'No existe data en bd'
            });
        }

        res.json({
            ok: true,
            busqueda,
            usuariosDB,
            medicosDB,
            hospitalesDB
        });

    } catch (error) {
        console.log(erro);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });

    }
};

getDocumentosColeccion = async(req = request, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regExp = new RegExp(busqueda, 'i');
    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regExp })
                .populate('usuario', 'nombre img')
                .populate('hospial', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regExp });

            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regExp })
                .populate('usuario', 'nombre img');

            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'No existe la colección ingresada'
            });
    }

    res.json({
        ok: true,
        data
    });
};

module.exports = {
    getTodo,
    getDocumentosColeccion
}