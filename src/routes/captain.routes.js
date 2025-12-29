const {Router} = require('express');
const {registerValidator,loginValidator} = require('../validators/captain.validator.js')
const {registerCaptain,loginCaptain,getProfile,logOutCaptain,changeCaptainStatus, getPreviousRides} = require('../controllers/captain.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const { previousRidesValidator } = require('../validators/user.validator.js');

const router = Router();

router.post('/register',registerValidator, registerCaptain);

router.post('/login',loginValidator,loginCaptain);

router.get('/profile',authMiddleware, getProfile);

router.get('/logout',authMiddleware,logOutCaptain);

router.get('/previous-rides',authMiddleware,previousRidesValidator,getPreviousRides)

router.patch('/updateStatus',authMiddleware,changeCaptainStatus);


module.exports = router;