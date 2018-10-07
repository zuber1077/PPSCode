const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    username: { type: String, unique: true, default: '' },
    password: {type: String, default: ''},
    google: {type: String, default: '' }
});
//encrypt password 
userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);//generate hash(salt) and encrypt z password before save to db /length of 10
};
//encrypt z password when z user trying to login
userSchema.methods.validUserPassword = function (password) {
  return bcrypt.compareSync(password, this.password); //to compare input user password and z db 
};
module.exports = mongoose.model('User', userSchema);