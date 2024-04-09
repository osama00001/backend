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
        minlength: 8,
        select:false

    },
    confirmPassword: {
        type: String,
        select:false,
        validate: {
            validator: function(value) {
                // Assuming 'this' refers to the document being saved
                return value === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    isPasswordChanged:Date,
    role:{
        type:String,
        enum:['user','admin','guide','lead-guide'],
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    userActive:{
        type:Boolean,
        default:true,
        select:false
    }
    

});
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')||this.isNew) {
        return next();
    }
    this.isPasswordChanged=Date.now()
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword =undefined
    next();
});

userSchema.pre(/^find/,function(next){
    this.find({userActive:{$ne:false}})
    next()
})

const User = mongoose.model('User', userSchema);
module.exports = User;
