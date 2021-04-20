const router = require('express').Router();
const apiController = require('../controllers/chartController');

router.get('/dashboardPage',apiController.chartJs);

module.exports = router;