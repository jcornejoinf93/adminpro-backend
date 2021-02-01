const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req = request, res = response, next) => {

    // Leer el token
    const token = req.header('x-token');
    //console.log(token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existe token'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(uid);
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });

    }

};

module.exports = {
    validarJWT
};