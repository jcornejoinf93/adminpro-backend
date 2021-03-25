/* 
Rutas: /api/usuarios
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, eliminaUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_mismoUsuario } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validarCampos');

const router = Router();

router.get('/', [validarJWT], getUsuarios);

router.post('/', [
        check('nombre', 'Campo nombre es obligatorio').not().isEmpty(),
        check('password', 'Campo password es obligatorio').not().isEmpty(),
        check('email', 'Se debe validar el email').isEmail(),
        validarCampos
    ],
    crearUsuario);

router.put('/:id', [validarJWT, validarADMIN_ROLE_o_mismoUsuario], [
        check('nombre', 'Campo nombre es obligatorio').not().isEmpty(),
        check('email', 'Campo email es obligatorio').isEmail(),
        check('role', 'Campo role es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminaUsuario);


module.exports = router;