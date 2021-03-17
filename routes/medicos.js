/**
 * ruta: /api/medicos
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { creaMedico, getMedicos, eliminarMedico, actualizarMedico, getMedicoPorId } = require('../controllers/medicos');
const { validarJWT } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validarCampos');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del medico es obliatorio').not().isEmpty(),
        check('hospital', 'El id del hospital no es válido').isMongoId(),
        validarCampos
    ],
    creaMedico);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('hospital', 'El hospital debe tener un id válido').isMongoId(),
    validarCampos
], actualizarMedico);
router.delete('/:id', [validarJWT], eliminarMedico);
router.get('/:id', [validarJWT], getMedicoPorId);

// router.get('/:id', getMedicoPorId);

module.exports = router;