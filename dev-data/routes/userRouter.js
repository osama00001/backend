const express = require('express');
const User = require('../controllers/userController');
const {signup, login, protectRoute, restrictedTo, forgotPassword, resetPassword, updatePassword} = require('../controllers/authController');
const userRouter = express.Router()
userRouter.route('/login').post(login)
userRouter.route('/signup').post(signup)
userRouter.route('/forgotPassword').post(forgotPassword)
userRouter.route('/resetPassword/:resetToken').patch(resetPassword)
userRouter.route('/updatePassword').patch(protectRoute,restrictedTo('user'),updatePassword)

userRouter.route('/').get(protectRoute,restrictedTo('admin','admin2','user'),User.getAllUsers).post(User.createUser)
userRouter.route('/:id',protectRoute,restrictedTo('admin','admin2','user')).patch(User.updateUser).delete(User.deleteUser);

module.exports = userRouter