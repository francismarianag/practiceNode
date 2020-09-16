const jwt = require('jsonwebtoken');


let verifyToken = (req, res, next) => {
    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.userDB = decoded.userDB
        next()
    })

}

let verifyAdmin = (req, res, next) => {
    let usuario = req.userDB;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verifyToken,
    verifyAdmin
};
