var mongoose = require('mongoose');
var constants = require('../lib/constants');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: constants.STRING,
        required:constants.TRUE,
        unique:constants.TRUE
    },
    email:{
        type: constants.STRING,
        unique:constants.FALSE
    },
    contactNumber:{
        type: constants.STRING
    },
    password: {
        type: constants.STRING,
        required:constants.TRUE
    },
    type: {
        type: constants.STRING,
        required:constants.TRUE,
        default: 0
	}
})

module.exports = mongoose.model('User', userSchema);