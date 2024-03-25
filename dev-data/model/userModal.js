const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name should be required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User must have email'],
        unique: true,
        lowercase: true, 
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(value) {
                // Assuming 'this' refers to the document being saved
                return value === this.password;
            },
            message: 'Passwords do not match'
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword =undefined
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
