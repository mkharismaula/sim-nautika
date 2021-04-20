const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/dashboard',adminController.viewDashboard);


router.get('/user',adminController.viewUser);
router.get('/user/:id',adminController.viewDetailUser);
router.post('/user',uploadSingle,adminController.addUser);
router.delete('/user/:id/kapal/:idKapal',adminController.deleteUser);


router.get('/kapal',adminController.viewKapal);
router.get('/formkapal',(req,res) => {
    res.render('admin/kapal/add_kapal.ejs');
});
router.post('/kapal',adminController.addKapal);
router.delete('/kapal/:id',adminController.deleteKapal);


router.get('/abk',adminController.viewAwakKapal);


router.get('/mutasi',adminController.viewMutasi);
router.post('/mutasi',adminController.addMutasi);

module.exports = router;