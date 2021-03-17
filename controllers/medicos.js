const { request, response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicosDB = await Medico.find()
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
    })
}

const getMedicoPorId = async(req = request, res = response) => {
    const id = req.params.id;

    try {
        const medicoDB = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img')

        res.json({
            ok: true,
            medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}

const creaMedico = async(req = request, res = response) => {

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




const actualizarMedico = async(req = request, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    const campos = {
        ...req.body,
        usuario: uid
    };


    try {

        const medicoDB = await Medico.findByIdAndUpdate(id, campos, { new: true });

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese médico en nuestra base de datos'
            });
        }

        res.json({
            ok: true,
            msg: 'Medico actualizado',
            medicoDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
};

const eliminarMedico = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const medicoEliminado = await Medico.findByIdAndDelete(id);

        if (!medicoEliminado) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el id del medico en nuestra base de datos'
            });
        }

        res.json({
            ok: true,
            msg: 'Medico eliminado',
            medicoEliminado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });

    }
};

module.exports = {
    creaMedico,
    getMedicos,
    actualizarMedico,
    eliminarMedico,
    getMedicoPorId
};