const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const captainSchema = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String,
        required:true,
        minLength:[6,'Password must be at least 6 characters long']
    },
    phone: { 
        type: String, 
        required: true, 
        unique: true 
    },
    licenseNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    rating: { type: Number, default: 0 },
    status: { type: Boolean,
         default: false,  // false means unavailable, true means available
     },
    socketId: { type: String  },
    vehicle: {
        color: { type: String, required: true },
        plate: {
            number: { type: String, required: true },
            state: { type: String, required: true }
        },
        capacity:{
            type: Number,
            required: true 
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ["sedan", "suv", "van", "motorcycle"]
        }
    },
    location: {
        ltd:{
            type: Number,
        },
        lng:{
            type: Number,
        }
    }

}, { timestamps: true });

captainSchema.methods.generateToken = async function(){
    return await jwt.sign({
        id: this._id,
    },
    process.env.JWT_SECRET, 
    { 
        expiresIn: '24h'
    }
)
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

captainSchema.methods.updateAvailability = async function(){
    this.status = !this.status;
    await this.save();
}

captainSchema.pre('save',async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
})




const Captain = mongoose.model('Captain', captainSchema);
module.exports = Captain;