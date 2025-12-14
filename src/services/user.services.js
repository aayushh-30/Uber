const User = require('../models/user.model');
const createUser = async({firstName,lastName, email, password}) => {
    try {
        const newUser = new User({
            fullName:
            {
                firstName,
                lastName
            }, 
            email, 
            password
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

const loginUserServ = async(email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return user;
    } catch (error) {
        throw new Error('Error logging in user: ' + error.message);
    }
}

module.exports = {
    createUser,
    loginUserServ
};