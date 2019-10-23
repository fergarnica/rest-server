const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }

            })
    }

    //Validad tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No es un tipo valido de archivo'
                }

            })
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.')[0];
    let extension = archivo.name.split('.')[1];

    //Extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'La extensión del archivo no esta permitida',
                    ext: extension
                }

            })
    }

    //Cambiar nombre al archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${fileName}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui imagen cargada
        if(tipo === 'usuarios'){

            imagenUsuario(id, res, fileName);

        }else{

            imagenProducto(id, res, fileName);

        }

    });
});


let imagenUsuario = (id, res, fileName) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borraArchivo(fileName, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borraArchivo(fileName, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        /* let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        } */

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = fileName;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: fileName
            });

        });
    });
}

let imagenProducto = (id, res, fileName) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

           borraArchivo(fileName, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borraArchivo(fileName, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = fileName;


        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: fileName
            });

        });

    })
}

let borraArchivo = (nombreImagen, tipo) => {
   
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;