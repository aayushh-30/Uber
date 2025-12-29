const Ride = require("../models/ride.model.js");
const {calculateDistanceTime,
    getCaptainRadius,
    getAddressCoordinate,
    getAutoCompleteSuggestionsService
} = require("../services/maps.services.js")
const crypto = require('crypto');

const bcrypt = require('bcrypt');

const getFareService = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and Destination are required");
    }

    const distanceTime = await calculateDistanceTime(pickup, destination);
    console.log("Distance and Time:", distanceTime);

    const distanceInKm = Number(distanceTime.distance_km);
    console.log("Distance in KM:", distanceInKm);
    const baseFare = {
        auto: 100,
        sedan: 200,
        suv: 300,
        van: 400,
        motorcycle: 500
    };

    const perKmRate = {
        auto: 10,
        sedan: 20,
        suv: 30,
        van: 40,
        motorcycle: 50
    };

    const fare = {
        auto: Math.round(baseFare.auto + distanceInKm * perKmRate.auto),
        sedan: Math.round(baseFare.sedan + distanceInKm * perKmRate.sedan),
        suv: Math.round(baseFare.suv + distanceInKm * perKmRate.suv),
        van: Math.round(baseFare.van + distanceInKm * perKmRate.van),
        motorcycle: Math.round(baseFare.motorcycle + distanceInKm * perKmRate.motorcycle)
    };

    console.log(fare);
    return fare;
};


const getOTPService = async (num) => {
    function generateOTP(num){
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOTP(num);
}

const createRideService = async(userID,pickup,destination,vehicleType) => {
    const allFare = await getFareService(pickup, destination);

    const newRide = await Ride.create({
        user:userID,
        pickup,
        destination,
        fare:allFare[vehicleType],
        vehicleType,
        status:"pending",
        otp:await getOTPService(4)
    });

    return newRide
}

const confirmRideService = async({rideId,captain}) => {
    const ride = await Ride.findOneAndUpdate({_id:rideId},
        {status:"accepted",captain},
        {new:true})
        .populate("user").populate("captain").select("+otp");

    return ride

}

const startRideService = async({rideId,otp,captain}) => {
    const ride = await Ride.findOne({
        _id:rideId,
    }).populate("user").populate("captain").select("+otp");

    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (ride.status !== "accepted") {
        throw new Error("Ride not accepted");
    }

    await Ride.findOneAndUpdate({_id:rideId}, {status:"ongoing"});

    return ride
}

const endRideService = async ( {rideId,captain}) => {
    const ride = await Ride.findOne({
        _id:rideId,
    }).populate("user").populate("captain").select("+otp");

    if (ride.status !== "ongoing") {
        throw new Error("Ride not ongoing");
    }

    await Ride.findOneAndUpdate({_id:rideId}, {status:"completed"});

    return ride

}

module.exports = {
    getFareService,
    getOTPService,
    createRideService,
    confirmRideService,
    startRideService,
    endRideService
};