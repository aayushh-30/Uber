const {body} = require('express-validator')

const registerValidator = [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName").isLength({min:3}).withMessage("Firstname should be atleast 3 character Length"),
    body("password").isLength({min:6}).withMessage("Password should atleast 6 character length"),
]

const loginValidator = [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:6}).withMessage("Password should atleast 6 character length"),
]

module.exports = {
    registerValidator,
    loginValidator
}