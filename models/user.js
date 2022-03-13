var mongoose = require('mongoose');
var constants = require('../lib/constants');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: constants.STRING,
        required:constants.TRUE,
    },
    email:{
        type: constants.STRING
    },
    phoneNumber:{
        type: constants.STRING,
        required:constants.TRUE,
        unique:constants.TRUE
    },
    password: {
        type: constants.STRING
    },
    type: {
        type: constants.STRING,
        required:constants.TRUE,
        default: 0
	}
})

module.exports = mongoose.model('User', userSchema);