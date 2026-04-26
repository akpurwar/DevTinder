const mongoose = require('mongoose');;

const connectDB = async()=> {
   await mongoose.connect('mongodb+srv://namastedev:PurwarAkash@namastenode.uq3xsjm.mongodb.net/devTinder?appName=NamasteNode')
}



module.exports = connectDB;