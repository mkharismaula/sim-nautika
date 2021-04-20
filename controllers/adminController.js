const User = require('../models/user');
const Kapal = require('../models/kapal');
const Mutasi = require('../models/mutasi');
const moment = require('moment');

const axios = require('axios');
const cheerio = require('cheerio');

const path = require('path');

module.exports = {
    viewDashboard : async (req,res) => {
        try {
            const user = await User.find().populate({ path: 'kapalSaatIni',select: '_id namaKapal' });
            const kapal = await Kapal.find();
            const mutasi = await Mutasi.find().populate('idAbk');
            res.render('admin/dashboard/view_dashboard',{
                user,
                kapal,
                mutasi,
                moment: moment
            });
            
        } catch (error) {
            console.log(`viewDashboard ${error.message}`);
        }
    },

    viewUser : async (req,res) => {
        try {
            const user = await User.find();
            const kapal = await Kapal.find();
            res.render('admin/user/view_user',{
                title: 'SimNautika | User',
                user,   
                kapal
            });
        } catch (error) {
            console.log(`viewUser ${error}`);
        }
    },
    addUser : async (req,res) => {
        try {
            const { nama,email,imageUrl,alamat,kapalSaatIni,kualifikasiTugas } = req.body;
            const kapal = await Kapal.findOne({ _id: kapalSaatIni });
            const newUser = {
                nama,
                email,
                imageUrl: `images/${req.file.filename}`,
                alamat,
                kapalSaatIni,
                kualifikasiTugas
            };
            const user = await User.create(newUser);
            kapal.userId.push({ _id: user._id });
            await kapal.save();

            res.redirect('user');      
        } catch (error) {
            console.log(`addUser ${error}`);
        }
        
    },
    deleteUser : async (req,res) => {
        const { id,idKapal } = req.params;
        try {
            const user =  await User.findOne({ _id: id });

            const kapal = await Kapal.findOne({ _id: idKapal }).populate('userId');
            for (let i = 0; i < kapal.userId.length; i++) {
                if (kapal.userId[i].id.toString() === user._id.toString()) {
                    kapal.userId.pull({ _id: user._id });
                    await kapal.save();
                }
            }
            await user.remove();
            res.redirect('/');

        } catch (error) {
            console.log(`Delete User Error ${error}`);
        }
    },
    viewDetailUser : async (req,res) => {
        const { id } = req.params;
        try {
            const user = await User.find({ _id: id }).populate('kapalSaatIni');
            const kapal = await Kapal.find();
            res.render('admin/user/view_detail_user',{
                user,
                kapal
            });
        } catch (error) {
            console.log(`view Detail User ${error.message}`);
        }
    },
    // KAPAL
    viewKapal : async (req,res) => {
        try {
            const kapal = await Kapal.find();
            res.render('admin/kapal/view_kapal',{
                title: 'SimNautika | Kapal',
                kapal
            })
        } catch (error) {
            console.log(`viewKapal ${error}`)
        }
    },
    addKapal : async (req,res) => {
        try {
            const { namaKapal,jenisKapal,maxAwak,awakTerisi,status } = req.body;
            await Kapal.create({
                namaKapal,
                jenisKapal,
                maxAwak,
                awakTerisi,
                status
            }); 
            res.redirect('kapal');
        } catch (error) {
            console.log(`addKapal ${error}`);
        }
    },
    deleteKapal : async (req,res) => {
        try {
            const { id } = req.params;
            const kapal  = await Kapal.findOne({ _id: id });
            await kapal.remove();
            res.redirect('/admin/kapal');
        } catch (error) {
            console.log(error.message);
        }
    },
    // AWAK KAPAL
    viewAwakKapal : async (req,res) => {
        try {
            // const user = await User.find({ 'kualifikasiTugas' : 'Kelasi'});
            const kapal = await Kapal.find().populate({ path: 'userId',select: 'nama kualifikasiTugas' });
            const user = await User.find();

            res.render('admin/abk/view_abk',{
                title: 'SimNautika | ABK',
                kapal,
                user                
            });
        } catch (error) {
            console.log(`viewAwakKapal ${error}`);
        }
    },
    viewSelectedKapal : async (req,res) => {
        const { id } = req.params;

        try {
            const kapal = Kapal.find();
            const user = User.find();

        } catch (error) {
            
        }
    },

    // MUTASI
    viewMutasi : async (req,res) => {
        try {
            const user = await User.find().populate({ path: 'kapalSaatIni',select: '_id namaKapal' });
            const kapal = await Kapal.find();
            res.render('admin/mutasi/view_mutasi',{
                user,
                kapal
            });
        } catch (error) {
            console.log(`viewMutasi ${error.message}`);
        }
    },
    addMutasi : async (req,res) => {

        axios.get('http://localhost:3000/admin/mutasi').then((res)=> {
            const $ = cheerio.load(res.data);
            $('.idKapalBaru').find('option').each((i,op) => {
                console.log($(op).text());
            })
            console.log($('select[name=idKapalBaru] option').first().attr('value'));
            // console.log($('.idKapalBaru').html());
        });

        try {
            const { idUser,tglMutasi,idKapalLama,idKapalBaru } = req.body;
            const mutasi = await Mutasi.create({
                idAbk: idUser,
                tglMutasi,
                kapalLama: idKapalLama,
                kapalBaru: idKapalBaru
            });
            const newKapal = await Kapal.findOneAndUpdate(
                { _id: idKapalBaru },
                {$push : {
                    userId:idUser
                }}
            );
            await newKapal.save();

            const oldKapal = await Kapal.findOneAndUpdate(
                {_id: idKapalLama},
                {$pull : {
                    userId:idUser
                }}
            );
            await oldKapal.save();
                        
            const user = await User.findOne({ _id: idUser });
            user.kapalSaatIni = newKapal._id;
            await user.save(); //-> berisi objectid idKapalBaru
            
            const riwayatKapalUser = await User.findOneAndUpdate(
                {_id: idUser},
                {$push: {
                    "riwayatKapal":{
                        "kapal": newKapal._id,
                        "tanggal": tglMutasi
                    }
                }}
            )
            await riwayatKapalUser.save();

            res.redirect('mutasi');
        } catch (error) {
            console.log(`addMutasi ${error.message}`)
        }
    }

}