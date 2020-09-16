const express = require('express');
const _ = require('underscore');
const Category = require('../models/category');
const { verifyToken, verifyAdmin } = require('../middlewares/autentication');
const router = express.Router();

router.get('/', verifyToken, (req, res, next) => {

    Category.find({ state: true })
        .sort('name')
        .populate('user', 'name')
        .exec((err, categoriesDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoriesDB
            });
        })

});

router.get('/:id', verifyToken, (req, res, next) => {
    let id = req.params.id

    Category.findById(id, (err, categoriesDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: { message: 'Id no existe' }
            })
        }

        res.json({
            ok: true,
            categoriesDB
        });
    });

});

router.post('/', verifyToken, (req, res, next) => {
    let body = req.body

    console.log(body)

    let category = new Category({
        name: req.body.name,
        user: req.userDB._id
    })

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoryDB
        })

    })


});

router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    let body = req.body.name;

    Category.findByIdAndUpdate(id, { name: body }, { new: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoryDB
        });

    })
});

router.delete('/:id', [verifyToken, verifyAdmin], (req, res, next) => {

    let id = req.params.id;

    Category.findByIdAndUpdate(id, { state: false }, { new: true }, (err, categoryDBDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDBDeleted) {
            return res.status(400).json({
                ok: false,
                err: { message: 'ID no existe' }
            })
        }

        res.json({
            ok: true,
            categoryDBDeleted
        })
    })
});

module.exports = router;
