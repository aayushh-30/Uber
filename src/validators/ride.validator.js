const {body} = require('express-validator')

const createRideValidator = [
  body("pickup")
    .notEmpty().withMessage("Pickup location is required")
    .isString().withMessage("Pickup must be a string"),

  body("destination")
    .notEmpty().withMessage("Destination is required")
    .isString().withMessage("Destination must be a string"),

  body("vehicleType")
    .notEmpty().withMessage("Vehicle type is required")
    .isIn(["sedan", "suv", "van", "motorcycle"])
    .withMessage("Invalid vehicle type"),

]

const fareValidation = [
    body("pickup")
    .notEmpty().withMessage("Pickup location is required")
    .isString().withMessage("Pickup must be a string"),

    body("destination")
    .notEmpty().withMessage("Destination is required")
    .isString().withMessage("Destination must be a string"),

]

const confirmRideValidator = [
    body("rideId")
    .notEmpty().withMessage("Ride ID is required")
    .isMongoId().withMessage("Ride ID must be a string")
]

module.exports = {createRideValidator,fareValidation,confirmRideValidator}