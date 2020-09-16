const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { verifyToken } = require('../middlewares/autentication');
const router = express.Router();

/* GET users listing. */
router.get('/', verifyToken, (req, res, next) => {

  let from = Number(req.query.from || 0);
  let limit = Number(req.query.limit || 5)

  User.find({ state: true }, 'name email role')
    .skip(from)
    .limit(limit)
    .exec((err, usersDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      User.count({state: true}, (err, cont) => {
        res.json({
          ok: true,
          usersDB,
          total: cont
         });
      })
    })

});

router.post('/', (req, res, next) => {
  let body = req.body
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      userDB
    })

  })


});

router.put('/:id', (req, res, next) => {
  let id = req.params.id
  let body = _.pick(req.body, ['name', 'email', 'img', 'state'])
    ;
  User.findByIdAndUpdate(id, body, {new: true}, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      userDB
     });

  })
});

router.delete('/:id', (req, res, next) => {

  let id = req.params.id;

  User.findByIdAndUpdate(id, { state : false}, { new: true }, (err, userDBDeleted) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!userDBDeleted) {
      return res.status(400).json({
        ok: false,
        err : { message: 'Usuario no encontrado'}
      })
    }

    res.json({
      ok: true,
      userDBDeleted
    })
  })
});

module.exports = router;
