const Captain = require('../models/captain.model.js');
const Ride = require('../models/ride.model.js');

const createCaptain = async({firstName,lastName, email, password,phone,licenseNumber,color,number,state,capacity,vehicleType}) => {
    try {
        const newCaptain = new Captain({
            name:
            {
                firstName,
                lastName
            }, 
            email, 
            password,
            phone,
            licenseNumber,
            vehicle:{
                color,
                plate:{
                    number,
                    state
                },
                capacity,
                vehicleType
            }
        });
        await newCaptain.save();
        return newCaptain;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

const loginCaptainServ = async(email, password) => {
    try {
        const captain = await Captain.findOne({ email });
        if (!captain) {
            throw new Error('Captain not found');
        }
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return captain;
    } catch (error) {
        throw new Error('Error logging in Captain: ' + error.message);
    }
}

const getPreviousRidesServ = async (captain, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const rides = await Ride.find({ captain })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ride.countDocuments({ captain });

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      rides
    };

  } catch (error) {
    throw new Error('Error fetching previous rides: ' + error.message);
  }
};

module.exports = {
    createCaptain,
    loginCaptainServ,
    getPreviousRidesServ
};