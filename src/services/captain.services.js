const Captain = require('../models/captain.model.js');

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

module.exports = {
    createCaptain,
    loginCaptainServ
};