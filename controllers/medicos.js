const { request, response } = require('express');
const Medico = require('../models/medico');

getMedicos = async(req = request, res = response) => {

    try {

        medicosDB = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img')

        if (medicosDB.length === 0) {
            return res.json({
                ok: false,
                msg: 'No existen medicos en BD'
            });
        }

        res.json({
            ok: true,
            medicosDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });

    }
};

creaMedico = async(req = request, res = response) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }

};

module.exports = {
    creaMedico,
    getMedicos
};