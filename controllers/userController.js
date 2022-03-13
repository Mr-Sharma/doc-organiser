var user = require('../models/userTable');
otpController=require('./otpController')
var constants = require('../lib/constants');

module.exports.postUser = function(req, res) {
	var data= {};
	if(!req.body || !req.body.username || !req.body.phoneNumber) {
		res.status(constants.FOUR_HUNDRED).json({success:false, message:'username or phoneNumber is missing'});
		return;
	} else {
		data.username = req.body.username;
		data.phoneNumber = req.body.phoneNumber
	}
		
	if(req.body.email) {
		data.email = req.body.email;
	}
	if(req.body.password) {
		data.password = req.body.password;
	}
	if(req.body.type) {
		data.type = req.body.type;
	}
	user.createUser(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.authenticateUser = function(req, res) {
	const data=req.body || {};
	if(!data.username || !data.password) {
		res.status(constants.FOUR_HUNDRED).json({success:false, message:'username or password is missing'});
		return;
	}
	user.authenticateUser(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.fetchAllUsers = function(req, res) {
	user.fetchAllUsers(function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.fetchAllUsersByType = function(req, res) {
	const type = req.params.type;
	if(type) {
		user.fetchAllUsersByType(type, function(err,msg){
			if(err){
				res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
			}else{
				res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
			}
		});
	} else {
		res.status(constants.FOUR_HUNDRED).json({success:false,message:'type is missing'});
	}
}

module.exports.fetchUser = function(req, res) {
	var data=req.params;
	user.fetchUser(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.deleteUser = function(req, res) {
	const _id =req.params._id;
	user.deleteUser(_id,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.updateUser = function(req, res) {
	var data=req.body;
	const _id = req.params._id;
	user.updateUser(_id,data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

//newly added
module.exports.checkUserPhoneExists = async function(req, res){
    var data = req.params.phoneNumber;
    try{
      var first = await user.checkUserPhoneExists(data)
      res.status(200).json({success:true,'message':first});
    }
    catch(err){
      res.status(400).json({success:false,'message':err});
    }
}

module.exports.sendOtpToPhoneNumberNew = function(req,res){
    var data=req.body;
    otpController.sendOtpNew(data,function(err,response){
        if(err){
            res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
        }else{
            res.status(constants.TWO_HUNDRED).json({success:true,message:response});
        }
    })
}

module.exports.resendOtpThroughPhoneNew = function(req,res){
    var data=req.body;
    otpController.resendOtpThroughPhoneNew(data,function(err,response){
        if(err){
            res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
        }else{
            res.status(constants.TWO_HUNDRED).json({success:true,message:response});
        }
    });
}

module.exports.verifyOtpThroughPhoneNew = function(req,res){
    var data=req.body;
    otpController.verifyOtpThroughPhoneNew(data,function(err,response){
        if(err){
            res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
        }else{
            res.status(constants.TWO_HUNDRED).json({success:true,message:response});
        }
    });
}