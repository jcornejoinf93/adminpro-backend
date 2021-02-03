const { response, request } = require("express");

const Hospital = require('../models/hospital');

const getHospital = async(req = request, res = response) => {

    try {

        const hospitalesDB = await Hospital.find()
            .populate('usuario', 'nombre img')

        if (hospitalesDB.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No existen hospitales en BD'
            });
        }

        res.json({
            ok: true,
            hospitalesDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });

    }


};

const crearHospital = async(req = request, res = response) => {

    const body = req.body;
    const uid = req.uid;
    //console.log(uid);

    const hospital = new Hospital({
        usuario: uid,
        ...body
    });

    try {
        await hospital.save((err, hospitalDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se pudo crear el hospital'
                });
            }

            res.json({
                ok: true,
                msg: 'Se crea el hospital',
                hospitalDB
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error inesperado, consulte logs'
        });

    }

};

const actualizarHospital = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'Se actualiza el hospital'
    });

};

const eliminarHospital = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'Se elimina el hospital'
    });

};

module.exports = {
    getHospital,
    crearHospital,
    actualizarHospital,
    eliminarHospital
};