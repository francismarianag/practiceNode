const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


router.post('/', (req, res, next) => {

    let body = req.body

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'Usuario o contraseña incorrecto' }
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario o contraseña incorrecto' }
            })
        }

        let token = jwt.sign({
            userDB,
        }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })

        res.json({
            ok: true,
            userDB,
            token
        })
    });

});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

router.post('/google', async (req, res, next) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                e
            })
        })

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'Debe de usar una autenticacion'}
                })
            } else {
                let token = jwt.sign({
                    userDB,
                }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN });

                return res.json({
                    ok: true,
                    userDB,
                    token
                })
            }
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                password: bcrypt.hashSync('1234',10)
            })

            user.save((err, userDB) => {
                if (err) {
                  return res.status(500).json({
                    ok: false,
                    err
                  })
                }
                res.json({
                    ok: true,
                    userDB,
                    token
                })

            })
        }
    })

});


module.exports = router;
