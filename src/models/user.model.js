const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'First name must be at least 2 characters long']
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [5, 'Email must be at least 5 characters long']
    },
    password: {
        type: String,
        required: true,
    },
    socketID: {
        type: String
    }
}, { timestamps: true });

userSchema.methods.generateToken = async function(){
    return await jwt.sign({
        id: this._id,
    },
    process.env.JWT_SECRET, 
    { 
        expiresIn: '7d'
    }
)
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.pre('save',async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

module.exports = mongoose.model('User', userSchema);
