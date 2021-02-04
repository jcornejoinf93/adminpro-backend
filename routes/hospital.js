/**
 * ruta: '/api/hospitales'
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospital, crearHospital, actualizarHospital, eliminarHospital } = require('../controllers/hospital');
const { validarJWT } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validarCampos');

const router = Router();

router.get('/', getHospital);
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearHospital);
router.put('/:id', [
    validarJWT,
    check('nombre', 'Nombre es un campo obligatorio').not().isEmpty(),
    validarCampos
], actualizarHospital);
router.delete('/:id', [validarJWT], eliminarHospital);

module.exports = router;