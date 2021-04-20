const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    nama : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    // isNotif : {
    //     type: Boolean,
    // },
    kapalSaatIni : {
        type: ObjectId,
        ref: 'Kapal'
    },
    riwayatKapal : [{
        kapal:{
            type: String
        },
        tanggal:{
            type: Date
            // default:new Date(+new Date() + 7*24*60*60*1000)
        }
    }],
    jenisKelamin : {
        type: String
    },
    noHandphone : {
        type:Number
    },
    status: {
        type: String // Cuti,Masuk Kerja,
    },
    alamat : {
        type: String
    },
    kualifikasiTugas : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User',userSchema);