const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
  });
  const User = mongoose.model('User', userSchema);
  module.exports = User

//   const UserModal = new User({
//     name:'osama',
//     email:"osamasajid38@gmail.com",
//     age:23
//   })
//   setTimeout(()=>{
//     UserModal.save().then(entry=>{console.warn(entry)})
//   },7000)
  

 