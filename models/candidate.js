var mongoose = require('mongoose');
var constants = require('../lib/constants');
var Schema = mongoose.Schema;

var candidateSchema = new Schema({
    name: {
        type: constants.STRING,
        required:constants.TRUE
    },
    aadhar: {
        type: constants.STRING,
        required:constants.TRUE
    },
    answerSheet:{
        type: constants.ARRAY
    },
    pattingSheet:{
        type: constants.ARRAY
    },
    markSheet:{
        type: constants.ARRAY
    },
    cform:{
        type: constants.ARRAY
    },
    email: {
        type: constants.STRING
    },
    phoneNumber: {
        type: constants.STRING
    },
    createdAt:{
        type:Date,
        default:Date.now,
        trim:true
    }
})

module.exports = mongoose.model('Candidate', candidateSchema);