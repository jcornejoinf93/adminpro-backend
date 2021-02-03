const { request, response } = require("express");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req = request, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    try {

        // Validar tipo
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo seleccionado no es válido'
            });
        }

        // Validar que exista el archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Se debe seleccionar un archivo'
            });
        }

        // Procesar imagen
        const file = req.files.imagen;
        //console.log(file);

        const nombreCortado = file.name.split('.');
        //console.log(nombreCortado);
        const extension = nombreCortado[nombreCortado.length - 1];
        //console.log(extension);

        // Validar extensión
        const validarExtension = ['jpeg', 'jpg', 'png', 'gif'];
        if (!validarExtension.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: 'La extensión no es permitida'
            });
        }

        // Crear nombre del archivo
        const nombreArchivo = `${ uuidv4() }.${ extension }`;

        // Path para guardar la imagen
        const path = `./uploads/${ tipo }/${ nombreArchivo }`;
        file.mv(path, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'No fue posible mover imagen'
                });
            }
        });

        // Actualizar imagen en BD
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Se ha subido el archivo',
            nombreArchivo
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, verificar logs'
        });

    }

};

const retornaImagen = (req = request, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-image.png`);
        res.sendFile(pathImg);
    }


};

module.exports = {
    fileUpload,
    retornaImagen
};