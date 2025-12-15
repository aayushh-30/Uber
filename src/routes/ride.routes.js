const {Router} = require('express');
const {body,query} = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware.js')
const {createRide, getFare, confirmRide, startRide, endRide} = require('../controllers/ride.controller.js')
const {createRideValidator,fareValidation,confirmRideValidator} = require('../validators/ride.validator.js')


const router = Router();

router.post("/create",authMiddleware,createRideValidator,createRide)
router.get("/get-fare",authMiddleware,fareValidation,getFare)

router.post("/confirm",authMiddleware,confirmRideValidator,confirmRide)
router.get("/start-ride",authMiddleware,startRide)

router.post("/end-ride",authMiddleware,endRide)


module.exports = router
