var user = require('../models/userTable');
var constants = require('../lib/constants');

module.exports.postUser = function(req, res) {
	var data= {};
	if(!req.body || !req.body.username || !req.body.password) {
		res.status(constants.FOUR_HUNDRED).json({success:false, message:'username or password is missing'});
		return;
	} else {
		data.username = req.body.username;
		data.password = req.body.password
	}
		
	if(req.body.email) {
		data.email = req.body.email;
	}
	if(req.body.contactNumber) {
		data.contactNumber = req.body.contactNumber;
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
	var data=req.params;
	user.deleteUser(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.updateUser = function(req, res) {
	var data=req.body;
	user.updateUser(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}