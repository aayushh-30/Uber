const { validationResult } = require("express-validator");
const Ride = require("../models/ride.model.js");
const {
    calculateDistanceTime,
    getAddressCoordinate,
    getAutoCompleteSuggestionsService,
    getCaptainRadius
} = require("../services/maps.services.js");
const Captain = require("../models/captain.model.js");
const userModel = require("../models/user.model.js");
const { createRideService, getFareService, confirmRideService, startRideService, endRideService } = require("../services/ride.services.js");
const { sendMessageToSocketId } = require("../socket.js");

const createRide = async(req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {pickup,destination,vehicleType} = req.body;
        const userID = req.decoded.id;
        console.log("Data received:", {pickup,destination,vehicleType,userID});

        const newRide = await createRideService(userID,pickup,destination,vehicleType);

        console.log("New ride created:", newRide);

        //res.status(201).json({message:"Ride created successfully",newRide});

        const pickupCoordinate = await getAddressCoordinate(pickup);
        // const destinationCoordinate = await getAddressCoordinate(destination);

        const captainInRadius = await getCaptainRadius(pickupCoordinate.lat,pickupCoordinate.lng,2);

        newRide.otp = ""

        const rideWithUser = await Ride.findOne({_id:newRide._id}).populate("user").select("-password");

        captainInRadius.map( captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new ride',
                data: rideWithUser
            })
        })

        res.status(201).json({message:"Ride created successfully",rideWithUser});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}

const getFare = async(req,res) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    
    const {pickup,destination} = req.body;

    try {
        const fare = await getFareService(pickup,destination);
        res.status(200).json(fare);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

const confirmRide = async (req,res) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    const {rideId} = req.body;

    try {
        const ride = await confirmRideService({rideId,captain:req.decoded._id});
        const populatedRide = await Ride
            .findById(ride._id)
            .populate("user captain");

        sendMessageToSocketId(populatedRide.user.socketId, {
            event: 'ride confirmed',
            data: populatedRide
        })

        return res.status(200).json(populatedRide);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

const startRide = async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {rideId, otp} = req.body;

        try {
            const ride = await startRideService({rideId,otp,captain:req.decoded._id});
            const populatedRide = await Ride
            .findById(ride._id)
            .populate("user captain");

        // Notify USER
        sendMessageToSocketId(populatedRide.user.socketId, {
            event: "ride-started",
            data: populatedRide
        });

        return res.status(200).json(populatedRide);
        }
        catch (error) {
        console.error(error.message);
            res.status(400).json({message:"Ride not started"});
        
    }
}

const endRide = async (req,res) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
    }

    const {rideId} = req.body;

    try {
        const ride = await endRideService({rideId,captain:req.decoded._id});


        const populatedRide = await Ride
            .findById(ride._id)
            .populate("user");

        sendMessageToSocketId(populatedRide.user.socketId, {
            event: "ride-ended",
            data: populatedRide
        });

        return res.status(200).json(populatedRide);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:"Ride not ended"});
        
    }
}

module.exports = {
    createRide,
    getFare,
    confirmRide,
    startRide,
    endRide
}