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

const previousRidesValidator = [
    body("page").optional().isInt({min:1}).withMessage("Page must be a positive integer"),
    body("limit").optional().isInt({min:1}).withMessage("Limit must be a positive integer"),
]

module.exports = {
    registerValidator,
    loginValidator,
    previousRidesValidator
}