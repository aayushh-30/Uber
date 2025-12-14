const {createCaptain,loginCaptainServ} = require('../services/captain.services.js')
const {validationResult} = require('express-validator')
const Captain = require('../models/captain.model.js');

const registerCaptain = async (req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {name, email, password,phone,licenseNumber,vehicle} = req.body;
        const existingUser = await Captain.findOne(
            {
                    $or: [
                        { email },
                        { licenseNumber },
                        { phone },
                        {
                        'vehicle.plate.state': vehicle.plate.state,
                        'vehicle.plate.number': vehicle.plate.number
                        }
                    ]
            }
        );

if (existingUser) {
  if (existingUser.email === email) {
    return res.status(400).json({ message: "Captain with this email already exists" });
  }

  if (existingUser.licenseNumber === licenseNumber) {
    return res.status(400).json({ message: "Captain with this license number already exists" });
  }

  if (existingUser.phone === phone) {
    return res.status(400).json({ message: "Captain with this phone number already exists" });
  }

  if (
    existingUser.vehicle?.plate?.state === vehicle.plate.state &&
    existingUser.vehicle?.plate?.number === vehicle.plate.number
  ) {
    return res.status(400).json({ message: "Captain with this vehicle already exists" });
  }
}
    const newCaptain = await createCaptain({
            firstName:name.firstName,
            lastName:name.lastName,
            email,
            password,
            phone,
            licenseNumber,
            color:vehicle.color,
            number:vehicle.plate.number,
            state:vehicle.plate.state,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType
        })
        const token = await newCaptain.generateToken()
        res.status(201).json({message:"User registered successfully", token })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const loginCaptain = async(req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {email,password} = req.body;

        const captain = await loginCaptainServ(email, password);
        const token = await captain.generateToken()
        res.cookie('token', token);
        res.status(200).json({message:"Login Successful", token})

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getProfile = async(req,res) => {
    try {
        const { decoded } = req;
        const captain = await Captain.findById(decoded.id).select('-password');
        if (!captain) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.status(200).json({captain})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const logOutCaptain = async(req,res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({message:"Logout Successful"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const changeCaptainStatus = async(req,res) => {
    try {
        const { decoded } = req;
        const captain = await Captain.findById(decoded.id);
        if (!captain) {
            return res.status(401).json({ message: 'Captain not found' });
        }
        await captain.updateAvailability();
        res.status(200).json({message:"Status updated successfully", availability: captain.availability})
        
    } catch (error) {
        console.log(`Internal Server Error : ${error.message}`)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {
    registerCaptain,
    loginCaptain,
    getProfile,
    logOutCaptain,
    changeCaptainStatus
};