/**
 * ruta: /api/medicos
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { creaMedico, getMedicos } = require('../controllers/medicos');
const { validarJWT } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validarCampos');

const router = Router();

router.get('/', getMedicos);
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del medico es obliatorio').not().isEmpty(),
        check('hospital', 'El id del hospital no es válido').isMongoId(),
        validarCampos
    ],
    creaMedico);

module.exports = router;