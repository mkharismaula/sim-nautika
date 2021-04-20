const User = require('../models/user');
const Kapal = require('../models/kapal');
const Mutasi = require('../models/mutasi');

const moment = require('moment');

module.exports = {

    chartJs: async (req,res) => {
        try {
            const mutasi = await Mutasi.find().select('tglMutasi');
            // const oke = () => {for(let i = 0;i < mutasi.length;i++){
            //     moment(mutasi[i].tglMutasi).format('DD-MM-YYYY');
            // }}

            const user = await User.find();
            const userCount = await User.count();
            res.status(200).json({
                mutasi,
                userCount,
              })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}