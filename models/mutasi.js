const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const mutasiSchema = new mongoose.Schema({
    idAbk : {
        type: ObjectId,
        ref: 'User'
    },
    tglMutasi : {
        type: Date,
        required: true
    },
    kapalLama : {
        type: ObjectId,
        ref: 'Kapal'
    },
    kapalBaru : {
        type: ObjectId,
        ref: 'Kapal'
    }

})

module.exports = mongoose.model('Mutasi',mutasiSchema);