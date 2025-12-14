const {body} = require('express-validator');

const registerValidator = [
    body('name.firstName').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('name.lastName').isLength({min:3}).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('licenseNumber').notEmpty().withMessage('License number is required'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate.number').notEmpty().withMessage('Vehicle plate number is required'),
    body('vehicle.plate.state').notEmpty().withMessage('Vehicle plate state is required'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['sedan', 'suv', 'van', 'motorcycle']).withMessage('Invalid vehicle type'),

];

const loginValidator = [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:6}).withMessage("Password should atleast 6 character length"),
]

module.exports = {
    registerValidator,
    loginValidator
};