var candidate = require('../models/candidateTable');
const company = require('../models/companyTable');
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

//get documents by roll number
module.exports.getDocuments = function(req, res) {
	const rollNumber=req.params.rollNumber;
	if(!rollNumber) {
		res.status(constants.FOUR_HUNDRED).json({success:false,message:'No roll number found'});
		return;
	}
	company.getDocuments(rollNumber,function(err,msg){
		if(err){
			res.status(constants.FOUR_HUNDRED).json({success:false,message:err});
		}else if(msg) {
			res.status(constants.TWO_HUNDRED).json({success:true,message:msg});
		} else {
			res.status(constants.FOUR_HUNDRED).json({success:false,message:null});
		}
	});
}