require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//configuración global de rutas
app.use( require('./routes/index'));

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname , '../public')));

mongoose.connect(process.env.URLDB ,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
   (err, res) => {
    if(err){
        console.log("ERROR AL CONECTAR");
        throw err;
    } 
    console.log('BBDD Online');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT)
});