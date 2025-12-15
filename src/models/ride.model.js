const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Captain",
        required:true

    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","cancelled","completed","ongoing"],
        default:"pending"
    },
    duration:{
        type: Number //in seconds

    },
    distance:{
        type: Number //in meter
    },
    paymentID:{
        type: String
    },
    orderID:{
        type:String
    },
    signature:{
        type:String
    },
    otp:{
        type:String,
        select:false,
        required: true
    }
},{timestamps:true});

const Ride = mongoose.model("Ride",rideSchema)
module.exports = Ride