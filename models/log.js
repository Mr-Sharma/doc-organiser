var mongoose = require('mongoose');
var constants = require('../lib/constants');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    name: {
        type: constants.STRING,
        required:constants.TRUE
    },
    rollNumber: {
        type: constants.STRING,
        required:constants.TRUE
    },
    document: {
        type: constants.STRING
    },
    skipped: {
        type: constants.STRING,
        required:constants.TRUE
    },
    data:{
        type: constants.ARRAY
    },
    email: {
        type: constants.STRING
    },
    phoneNumber: {
        type: constants.STRING
    },
    updatedBy: {
        type: constants.STRING
    },
    createdAt:{
        type:Date,
        default:Date.now,
        trim:true
    },
    updatedAt:{
        type:Date,
        default:Date.now,
        trim:true
    }
})

module.exports = mongoose.model('Log', logSchema);