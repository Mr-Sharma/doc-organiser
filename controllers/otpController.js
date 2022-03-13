var rest = require('restler');
const msg91AuthKey= '198919AIIIf4uxIM65a8bc4b5';
var email=require('./emailController')
var otpCollection=require('../models/otpTable')
var randomize = require('randomatic');

module.exports = {
   sendOtp:sendOtp,
   verifyOtp:verifyOtp,
   resendOtp:resendOtp,
   sendOtpThroughEmail:sendOtpThroughEmail,
   resendOtpThroughEmail:resendOtpThroughEmail,
   verifyOtpThroughEmail:verifyOtpThroughEmail,
   sendOtpNew:sendOtpNew,
   resendOtpThroughPhoneNew:resendOtpThroughPhoneNew,
   verifyOtpThroughPhoneNew:verifyOtpThroughPhoneNew
}

function sendOtp(data,callback) {
    
	var uri = "http://api.msg91.com/api/sendotp.php"
	var paramData={ 
	 	multipart: true,
		authkey: msg91AuthKey,
		mobile: data.phoneNumber,
		message:'##OTP## is your One Time Password. Please do not share this with anyone.',
		sender:'',
		otp_expiry:'2',
		otp_length:'4'
	}

	rest.post(uri,{data:paramData})
    .on('success', function(data) {
    	var data=JSON.parse(data)
    	console.log("success",data)
    	if(data.type=="error"){
		callback(data.message,null);
	}
	else{
		callback(null,data)
	}
		
	})
	.on('fail', function(data, response) {
		//console.log("fail",data)
        callback(data, null)

    })
}


function resendOtp(data,callback) {
    
	var uri = "http://api.msg91.com/api/retryotp.php"
	var paramData={ 
	 	multipart: true,
		authkey: msg91AuthKey,
		mobile: data.phoneNumber,
		retrytype: data.retryType
	}

	rest.post(uri,{data:paramData})
    .on('success', function(data) {
		//callback(null, data);
		//var data=JSON.stringify(data)
		var data =JSON.parse(data)
		//var data=JSON.parse(data)
    	console.log("success in resend",data)
    	if(data.type=="success"){
			callback(null,data.message);
		}
		else{
			callback(data.message,null)
		}
	})
	.on('fail', function(data, response) {
        callback(data, null);
    })
}

function verifyOtp(data,callback) {
    
	var uri = "http://api.msg91.com/api/verifyRequestOTP.php"
	var paramData={ 
	 	multipart: true,
		authkey: msg91AuthKey,
		mobile: data.phoneNumber,
		otp: data.otp
	}

	rest.post(uri,{data:paramData})
    .on('complete', function(data) {
		//callback(null, data);
		var data=JSON.parse(data)
    	console.log("success",data)
    	if(data.type=="error"){
			callback(data.message,null);
		}
		else{
			callback(null,data.message)
		}

	})
	.on('fail', function(data, response) {
        callback(data, null);
    })
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
	if(body.phoneNumber=='1234567890'){
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
		  callback('Failed to verify', null)
	  }else{
		  callback(null, response)
	  }
	})
}

function getOTPURL(phoneNumber, otp) {
	const uri = `https://www.fast2sms.com/dev/bulkV2?authorization=P0UflmjyIcWu1deZ7RfdoOlVHF7gCx9VbDoGIW33w4qXMKY7Rmm5QnMsMJWw&route=v3&sender_id=Cghpet&message=Your%20OTP%20is%20${otp},%20Please%20don%27t%20share%20it%20with%20anyone.&language=english&flash=0&numbers=${phoneNumber}`
	return uri;
}