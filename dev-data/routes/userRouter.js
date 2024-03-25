const express = require('express');
const User = require('../controllers/userController');
const signup = require('../controllers/authController');
const userRouter = express.Router()

userRouter.route('/signup').post(signup)
userRouter.route('/').get(User.getAllUsers).post(User.createUser)
userRouter.route('/:id').patch(User.updateUser).delete(User.deleteUser);

module.exports = userRouter