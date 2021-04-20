const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const kapalSchema = new mongoose.Schema({
    namaKapal : {
        type: String,
        required: true
    },
    jenisKapal : {
        type: String,
        required: true
    },
    maxAwak : {
        type: Number,
        required:true
    },
    awakTerisi : {
        type: Number,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    userId : [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Kapal',kapalSchema);