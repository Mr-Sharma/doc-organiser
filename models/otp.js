var mongoose = require('mongoose'),
constants = require('../lib/constants'),
Schema = mongoose.Schema;

 
// Define our token schema
var OtpSchema = new Schema({
    otp: {
        type: String, 
        required: true,
        trim:true
    },
    email: {
        type: String,
        trim:true
    },
    phoneNumber: {
        type: String,
        trim:true
    },
    expireAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
 
// Expire at the time indicated by the expireAt field
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds : 120 });
 

module.exports = mongoose.model('otp', OtpSchema);