const { response } = require('express');
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        // Borra la imagen anterior
        fs.unlinkSync(path);
    }

};

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico._id) {
                console.log('El id no pertenece a un medico');
                return false;
            }
            const pathViejoMedico = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejoMedicoo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('El id no pertenece a un hospital');
                return false;
            }
            const pathViejoHospital = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejoHospital);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('El id no pertenece a un usuario');
                return false;
            }
            const pathViejoUsuario = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejoUsuario);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;

        default:
            return response.status(500).json({
                ok: false,
                msg: 'No ha especificado bien el tipo'
            });
    }
};

module.exports = {
    actualizarImagen
}