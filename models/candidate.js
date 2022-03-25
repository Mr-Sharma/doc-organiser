var mongoose = require('mongoose');
var constants = require('../lib/constants');
var Schema = mongoose.Schema;

var candidateSchema = new Schema({
    name: {
        type: constants.STRING,
        required:constants.TRUE
    },
    rollNumber: {
        type: constants.STRING,
        required:constants.TRUE
    },
    answerSheet:{
        type: constants.ARRAY
    },
    admissionApproval:{
        type: constants.ARRAY
    },
    packingSlip:{
        type: constants.ARRAY
    },
    markSheet:{
        type: constants.ARRAY
    },
    cform:{
        type: constants.ARRAY
    },
    certificate:{
        type: constants.ARRAY
    },
    answerSheetSkipped: {
        type: constants.BOOLEAN
    },
    admissionApprovalSkipped: {
        type: constants.BOOLEAN
    },
    packingSlipSkipped: {
        type: constants.BOOLEAN
    },
    cformSkipped: {
        type: constants.BOOLEAN
    },
    markSheetSkipped: {
        type: constants.BOOLEAN
    },
    certificateSkipped: {
        type: constants.BOOLEAN
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

module.exports = mongoose.model('Candidate', candidateSchema);