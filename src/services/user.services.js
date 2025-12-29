const User = require('../models/user.model');
const Ride = require('../models/ride.model');
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

const getPreviousRidesServ = async (user, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const rides = await Ride.find({ user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ride.countDocuments({ user });

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
    createUser,
    loginUserServ,
    getPreviousRidesServ
};