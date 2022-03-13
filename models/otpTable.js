 
const Otp = require('./otp');
const User = require('./user');

constants = require('../lib/constants');
//var SupportedCountryDetails = require('./supportedCountries');
//var uniqid = require('uniqid');
const randomize = require('randomatic');


module.exports = {
 generateOtp: generateOtp,
 verifyOtp:verifyOtp,
 verifyEmailId:verifyEmailId,
 storeOtp:storeOtp,
 verifyPhoneNumber:verifyPhoneNumber,
 verifyOtpThroughPhoneNew:verifyOtpThroughPhoneNew
}

function generateOtp(data,callback){
    if(data.email == "admin@testchampsindia.com"||data.email == "subadmin@testchampsindia.com"){
        Otp.create({
            otp:"1234",
            email:data.email
        },function(err,res){
            if(err){
            callback(err,null)
            }else{
            callback(null,res)
            }
        })
    } else {
        var otp=randomize('0000');
        Otp.create({
            otp:otp,
            email:data.email
        },function(err,res){
            if(err){
            callback(err,null)
            }else{
            callback(null,res)
            }
        }) 
    }   
}

function verifyOtp(data,callback){

 Otp.findOne({$and:[{"email":data.email},{"otp":data.otp}]}).exec(function(err, data) {
     //console.log(data)
     if(err){
       callback(err,null)
     }
     else if(data){
       callback(null,data)
     }
     else{
       callback("otp not found!",null)
     }
 })
}

function verifyEmailId(data,callback){

  Otp
 .findOne({"email":data.email})
 .exec(function(err, data) {
   //console.log(data)
   if(err){
     callback(err,null)
   }
   else if(data){
     callback(null,data)
   }
   else{
     callback("otp not found!",null)
   }
 })

}

function getUserId(data,callback){
  User
 .findOne({phoneNumber:data.phoneNumber})
 .exec(function(err, data) {
   //console.log(data)
   if(err){
     callback(err,null)
   }
   else if(data){
     callback(null,data.userId)
   }
   else{
     callback("user not found!",null)
   }
 })
}

//newly added
function storeOtp(data,callback){
    Otp.create({
        otp:data.otp,
        phoneNumber:data.phoneNumber
    }, function(err,res){
        if(err){
            callback(err,null)
        } else{
            callback(null,res)
        }
    })   
}

function verifyPhoneNumber(data,callback){
    Otp
    .findOne({"phoneNumber":data.phoneNumber})
    .exec(function(err, data) {
        if(err){
            callback(err,null)
        }
        else if(data){
            callback(null,data)
        }
        else{
            callback("otp not found!",null)
        }
    })
}

function verifyOtpThroughPhoneNew(data,callback){
    Otp
    .findOne({"phoneNumber":data.phoneNumber,otp:data.otp})
    .exec(function(err, res) {
        if(err){
            callback(err,null)
        }
        else if(res){
            User
            .findOne({"phoneNumber":data.phoneNumber})
            .exec(function(err, response) {
                if(err){
                    callback(err,null)
                }
                else if(response){
                    callback(null,response)
                }
                else{
                    callback("otp not found!",null)
                }
            })
        }
        else{
            callback("otp not found!",null)
        }
    })
}
