const {Router} = require('express')
const authMiddleware = require('../middlewares/auth.middleware.js')
const { query } = require('express-validator')
const { getAutoCompleteSuggestions, getDistanceTime, getCoordinates } = require('../controllers/maps.controller.js')

const router = Router()

router.get("/get-coordinates",query("address").isString().isLength({min:3}),authMiddleware,getCoordinates)

router.get("/get-distance-time", query("origin").isString().isLength({min:3}), query("destination").isString().isLength({min:3}), authMiddleware, getDistanceTime);

router.get("/get-suggestions",query("input").isString().isLength({min:3}), authMiddleware, getAutoCompleteSuggestions)




module.exports = router