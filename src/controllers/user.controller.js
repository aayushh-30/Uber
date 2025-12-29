const { validationResult } = require('express-validator')
const User = require('../models/user.model.js')
const {createUser,loginUserServ, getPreviousRidesServ} = require('../services/user.services.js')

const registerUser = async(req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {email,fullName,password} = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User with this email already exists"})
        }
        const newUser = await createUser({
            firstName:fullName.firstName,
            lastName:fullName.lastName,
            email,
            password
        })
        const token = await newUser.generateToken()
        console.log(token)
        res.status(201).json({message:"User registered successfully", token })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const loginUser = async(req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {email,password} = req.body;

        const user = await loginUserServ(email, password);
        const token = await user.generateToken()
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
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.status(200).json({user})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const logOutUser = async(req,res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({message:"Logout Successful"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getPreviousRides = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    try {
        const { decoded } = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const ridesData = await getPreviousRidesServ(decoded.id, page, limit);
        res.status(200).json(ridesData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logOutUser,
    getPreviousRides
};