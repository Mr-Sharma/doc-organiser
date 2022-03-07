
var Candidate = require('./candidate');
var multer  =   require('multer');
var path = require('path');
var uniqid = require('uniqid');
var fs = require('fs');
var pdf = require('html-pdf');


module.exports = {
  update:update,
  create: create,
  getAll:getAll,
  getCandidateById: getCandidateById,
  deleteCandidate:deleteCandidate
}

function create(data, callback){
  var obj = {};
  obj.name = data.body.name;
  obj.aadhar = data.body.aadhar;
  if(data.body.email) {
    obj.email = data.body.email
  }
  if(data.body.phoneNumber) {
    obj.phoneNumber = data.body.phoneNumber
  }
  Candidate.create(obj, function(err,res) {
    if(err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function update(data,callback){
  var filename = uniqid();
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.join(__dirname,'../uploads/documents'));
    },
    filename: function (req, file, callback) {
      callback(null, filename);
    }
  });

  
  var upload = multer({ storage : storage}).single('answerSheet');
  upload(data,callback,function(err) {
    if(err) {
      callback(err,null)
    } else {
      var filePath = '/uploads/documents/'+filename
      data.file.destination = filePath;
      data.file.path = filePath;
      var obj = {};
      obj.name = data.body.name;
      obj.aadhar = data.body.aadhar;
      obj.answerSheet = data.file;
      if(data.body.email) {
        obj.email = data.body.email
      }
      if(data.body.phoneNumber) {
        obj.phoneNumber = data.body.phoneNumber
      }
      Candidate.create(obj, function(err,res) {
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
