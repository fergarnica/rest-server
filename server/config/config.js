// PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO DEL TOKEN
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED DE AUTORIZACION
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//BASE DE DATOS
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb://fgarnica:TAyBg51RYRphs3d1@cluster0-vkbj2.mongodb.net/cafe';
}
process.env.URLDB =urlDB;

//Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '112910576335-8c89gliq8tv9u1i3a7pir383brug3e51.apps.googleusercontent.com';