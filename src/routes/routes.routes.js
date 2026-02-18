const {Router} = require('express');
const {getAllRoutes} = require('../controllers/routes.controller.js');

const router = Router();

router.get('/', getAllRoutes);

module.exports = router;
