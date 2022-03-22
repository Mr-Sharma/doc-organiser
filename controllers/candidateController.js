var candidate = require('../models/candidateTable');
var constants = require('../lib/constants');

module.exports.create = function(req, res) {
	var data=req.body;
	if(!data.name || !data.rollNumber) {
		res.status(constants.FOUR_HUNDRED).json({success:false,message:'name or rollNumber is missing'});
		return
	}
	candidate.create(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.update = function(req, res) {
	var data=req.body;
	if(!data._id || !data.name || !data.rollNumber) {
		res.status(constants.FOUR_HUNDRED).json({success:false,message:'name or rollNumber or _id is missing'});
		return
	}
	candidate.update(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.uploadFile = function(req, res) {
	var data={files:req.files, body:req.body};
	candidate.uploadFile(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.getAll = function(req, res) {
	candidate.getAll(function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}

module.exports.getCandidateById = function(req, res) {
	var data={}
	 data.candidateId=req.params.candidate_id;
	 candidate.getCandidateById(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}
module.exports.deleteCandidate = function(req, res) {
	var data={}
	data=req.params;
	candidate.deleteCandidate(data,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else{
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		}
	});
}