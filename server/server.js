require('./config/config')
const express = require('express');
const mongoose = require('mongoose');

const app = express();  //constructor de express

mongoose.connect('mongodb://localhost:27017/practicaNode',  { useNewUrlParser: true, createIndexes: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err

    console.log('Base de datos ONLINE')
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el pueto ${process.env.PORT}`)
})

module.exports = app;
