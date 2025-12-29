const { Router } = require('express');
const {registerValidator,loginValidator, previousRidesValidator} = require('../validators/user.validator.js')
const {registerUser,loginUser,getProfile, logOutUser, getPreviousRides} = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');


const router = Router();

router.get('/profile',authMiddleware, getProfile);

router.post('/register',registerValidator, registerUser)

router.post('/login',loginValidator, loginUser)

router.get('/logout',authMiddleware,logOutUser)

router.get('/previous-rides',authMiddleware,previousRidesValidator,getPreviousRides)

module.exports = router;