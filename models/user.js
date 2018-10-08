const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String,
        default: ''
    },
    password: {type: String, default: ''},
    google: {type: String, default: '' }
});
module.exports = mongoose.model('users', UserSchema);