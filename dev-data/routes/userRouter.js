const express = require('express');
const User = require('../controllers/userController');
const {signup, login, protectRoute} = require('../controllers/authController');
const userRouter = express.Router()
userRouter.route('/login').post(login)
userRouter.route('/signup').post(signup)

userRouter.route('/').get(protectRoute,User.getAllUsers).post(User.createUser)
userRouter.route('/:id').patch(User.updateUser).delete(User.deleteUser);

module.exports = userRouter