const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) =>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre:regex })
    .populate('categoria', 'descripcion')
    .exec( (err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            productos
        });
    });

});

// Obtener productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible:true })
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            productos
        });

    });

});

// Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'ID no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });



    });


});

// Crear productos
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    //console.log(body);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: productoDB
        });

    });

});

// Actualizar productos
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

   Producto.findById(id,(err, productoDB) => {

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    };

    if (!productoDB) {
        return res.status(500).json({
            ok: false,
            err:{
                message: 'El ID no existe'
            }
        });
    };

    productoDB.nombre = body.nombre;
    productoDB.disponible = body.disponible;
    productoDB.precioUni = body.precioUni;
    productoDB.descripcion = body.descripcion;
    productoDB.categoria = body.categoria;

    productoDB.save((err, productoGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoGuardado
        });


    })

   });


});

// Borrar productos
app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let statusProducto = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, statusProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'ID no existe'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

module.exports = app;