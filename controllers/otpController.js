var rest = require('restler');
var email=require('./emailController')
var otpCollection=require('../models/otpTable')
var randomize = require('randomatic');
const phoneNumbers = require('../lib/phoneNumbers');

module.exports = {
   sendOtpThroughEmail:sendOtpThroughEmail,
   resendOtpThroughEmail:resendOtpThroughEmail,
   verifyOtpThroughEmail:verifyOtpThroughEmail,
   sendOtpNew:sendOtpNew,
   resendOtpThroughPhoneNew:resendOtpThroughPhoneNew,
   verifyOtpThroughPhoneNew:verifyOtpThroughPhoneNew
}


function sendOtpThroughEmail(data,callback) {
	//obj.otp="2578"
//obj.email="bharath@mobilenerd.net"
otpCollection.generateOtp(data,function(err,response){
  if(err){
  	callback(err,null)
  }else{
  	data.otp=response.otp;
  	email.sendOtpToEmail(data,function(err,data){
	if(err){
		callback(err,null)
	}else{
		callback(null,"otp sent successfully")
	}
})
  }
})

	
}

function resendOtpThroughEmail(data,callback) {
	//obj.otp="2578"
//obj.email="bharath@mobilenerd.net"
otpCollection.verifyEmailId(data,function(err,response){
  if(err){
  	callback(err,null)
  }else{
  	data.otp=response.otp;
  	email.sendOtpToEmail(data,function(err,data){
	if(err){
		callback(err,null)
	}else{
		callback(null,"otp sent successfully")
	}
})
  }
})

	
}

function verifyOtpThroughEmail(data,callback) {
otpCollection.verifyOtp(data,function(err,response){
  if(err){
  	callback(err,null)
  }else{
  	callback(null,data)
  }
})

	
}

//newly added
function sendOtpNew(body,callback) {
	var otp=randomize('0000');
	const defaultNumbers = phoneNumbers.array || [];
	if(defaultNumbers.includes(body.phoneNumber)){
		otp = '1234';
		otpCollection.storeOtp({otp,phoneNumber:body.phoneNumber},function(err,response){
			if(err){
				callback(err,null)
			}else{
				callback(null,'Otp sent successfully')
			}
		})
	} else {
		var uri = getOTPURL(body.phoneNumber, otp);
		rest.get(uri)
		.on('success', function(data) {
			if(data.type=="error"){
				callback('failed',null);
			} else{
				otpCollection.storeOtp({otp,phoneNumber:body.phoneNumber},function(err,response){
					if(err){
						callback(err,null)
					}else{
						callback(null,'Otp sent successfully')
					}
				})
			}	
		})
		.on('fail', function(data, response) {
			//console.log("fail",data)
			callback(data, null)
	
		})
	}
}

function resendOtpThroughPhoneNew(data,callback) {
	otpCollection.verifyPhoneNumber(data,function(err,response){
		if(err){
			callback(err,null)
		} else {
			const otp=response.otp;
			var uri = getOTPURL(data.phoneNumber, otp);
			rest.get(uri)
			.on('success', function(data) {
				if(data.type=="error"){
					callback('failed',null);
				} else{
					callback(null,'Otp sent successfully')
				}
			})
			.on('fail', function(data, response) {
				//console.log("fail",data)
				callback(data, null)

			})
		}
	})
}

function verifyOtpThroughPhoneNew(data,callback) {
	otpCollection.verifyOtpThroughPhoneNew(data, function(err,response){
	  if(err){
		  callback(err, null)
	  }else{
		  callback(null, response)
	  }
	})
}

function getOTPURL(phoneNumber, otp) {
	const uri = `https://www.fast2sms.com/dev/bulkV2?authorization=P0UflmjyIcWu1deZ7RfdoOlVHF7gCx9VbDoGIW33w4qXMKY7Rmm5QnMsMJWw&route=v3&sender_id=Cghpet&message=Your%20OTP%20is%20${otp},%20Please%20don%27t%20share%20it%20with%20anyone.&language=english&flash=0&numbers=${phoneNumber}`
	return uri;
}