
var Candidate = require('./candidate');
var multer  =   require('multer');
var path = require('path');
var uniqid = require('uniqid');
var fs = require('fs');
var pdf = require('html-pdf');


module.exports = {
  update:update,
  create: create,
  uploadFile:uploadFile,
  getAll:getAll,
  getCandidateById: getCandidateById,
  deleteCandidate:deleteCandidate
}

function create(data, callback){
  var obj = {};
  obj.name = data.name;
  obj.aadhar = data.aadhar;
  Candidate.create(obj, function(err,res) {
    if(err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function update(data, callback){
  var obj = {};
  obj.name = data.name;
  obj.aadhar = data.aadhar;
  Candidate.findOneAndUpdate({_id: data._id}, {$set:obj}, {new: true}, function(err,res) {
    if(err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function uploadFile(data,callback){
  var filename = uniqid();
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.join(__dirname,'../uploads/documents'));
    },
    filename: function (req, file, callback) {
      callback(null, filename);
    }
  });

  
  var upload = multer({ storage : storage}).single('file');
  upload(data,callback,function(err) {
    if(err) {
      callback(err,null)
    } else {
      var filePath = '/uploads/documents/'+filename
      if(data.file && data.file.destination) {
        data.file.destination = filePath;
        data.file.path = filePath;
      }
      var obj = {};
      if(data.body.answerSheetSkipped != undefined && (data.body.answerSheetSkipped == false || data.body.answerSheetSkipped == "false")) {
        obj.answerSheet = data.file;
        obj.answerSheetSkipped = false;
      } else if(data.body.pattingSheetSkipped != undefined && (data.body.pattingSheetSkipped == false || data.body.pattingSheetSkipped == "false")) {
        obj.pattingSheet = data.file;
        obj.pattingSheetSkipped = false;
      } else if(data.body.cformSkipped != undefined && (data.body.cformSkipped == false || data.body.cformSkipped == "false")) {
        obj.cform = data.file;
        obj.cformSkipped = false;
      } else if(data.body.markSheetSkipped != undefined && (data.body.markSheetSkipped == false || data.body.markSheetSkipped == "false")) {
        obj.markSheet = data.file;
        obj.markSheetSkipped = false;
      } else if(data.body.certificateSkipped != undefined && (data.body.certificateSkipped == false || data.body.certificateSkipped == "false")) {
        obj.certificate = data.file;
        obj.certificateSkipped = false;
      } 
      if(data.body.answerSheetSkipped == true) {
        obj.answerSheetSkipped = true;
      }
      if(data.body.pattingSheetSkipped == true) {
        obj.pattingSheetSkipped = true;
      }
      if(data.body.cformSkipped == true) {
        obj.cformSkipped = true;
      }
      if(data.body.markSheetSkipped == true) {
        obj.markSheetSkipped = true;
      }
      if(data.body.markSheetSkipped == true) {
        obj.markSheetSkipped = true;
      }
      if(!data.body || (data.body.answerSheetSkipped == undefined && data.body.pattingSheetSkipped == undefined && data.body.cformSkipped == undefined && data.body.markSheetSkipped == undefined && data.body.certificateSkipped == undefined)) {
        callback('nothing to update');
        return;
      }
      Candidate.findOneAndUpdate({_id: data.body._id}, {$set: obj}, {new: true}, function(err,res) {
        if(err) {
          callback(err,null)
        } else {
          callback(null,res)
        }
      })
    }
  })
}

function getAll(callback){
  Candidate.find().
  exec(function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  });
}

function getCandidateById(data,callback){
  const id = data.candidateId;
  Candidate.findOne({_id:id}).
  exec(function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  });
}
  
function deleteCandidate(data,callback){
  const id = data.candidate_id;
  Candidate.findOneAndDelete({_id:id}).
  exec(function(err, res) {
    if (err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  });
}
