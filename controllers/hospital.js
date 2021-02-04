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

const actualizarHospital = async(req = request, res = response) => {

    const id = req.params.id;
    const body = req.body;

    try {

        const hospitalDB = await Hospital.findByIdAndUpdate(id, body, { new: true });

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese id en base de datos'
            });
        }
        res.json({
            ok: true,
            msg: 'Se actualiza el hospital',
            hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado, validar logs',
            error
        });

    }
};

const eliminarHospital = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        await Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            if (!hospitalEliminado) {
                return res.json({
                    ok: false,
                    msg: 'No existe el id del hospital'
                });
            }

            res.json({
                ok: true,
                msg: 'Se elimina el hospital',
                hospitalEliminado
            });
        });




    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }

};

module.exports = {
    getHospital,
    crearHospital,
    actualizarHospital,
    eliminarHospital
};