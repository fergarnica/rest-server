require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use( require('./routes/usuario'));

/* mongoose.connect('mongodb://localhost:27017/cafe', (err, resp) => {

    if(err) throw err;

    console.log('Base de Datos ONLINE');
}); */

mongoose.connect(process.env.URLDB ,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
   (err, res) => {
    if(err){
        console.log("ERROR AL CONECTAR");
        throw err;
    } 
    console.log('BBDD Online');
});


/* mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); */


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT)
});