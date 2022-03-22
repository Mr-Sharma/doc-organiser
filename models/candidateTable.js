
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
  obj.rollNumber = data.rollNumber;
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
  obj.rollNumber = data.rollNumber;
  Candidate.findOneAndUpdate({_id: data._id}, {$set:obj}, {new: true}, function(err,res) {
    if(err) {
      callback(err,null)
    } else {
      callback(null,res)
    }
  })
}

function uploadFile(data,callback){
  // var filePath = '/uploads/documents/'+filename
  // if(data.file && data.file.destination) {
  //   data.file.destination = filePath;
  //   data.file.path = filePath;
  // }
  var obj = {};
  var filePath = '';
  if(data.body.answerSheetSkipped != undefined && (data.body.answerSheetSkipped == false || data.body.answerSheetSkipped == "false")) {
    var answerSheetArray = [];
    const answerSheetBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      answerSheetBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          answerSheetArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
        }
      });
    }
    obj.answerSheet = answerSheetArray;
    obj.answerSheetSkipped = false;
  } else if(data.body.admissionApprovalSkipped != undefined && (data.body.admissionApprovalSkipped == false || data.body.admissionApprovalSkipped == "false")) {
    var admissionApprovalArray = [];
    const admissionApprovalBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      admissionApprovalBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          admissionApprovalArray.push({file:data.files[i], trade: element.trade, month: element.month, year: element.year});
        }
      });
    }
    obj.admissionApproval = admissionApprovalArray;
    obj.admissionApprovalSkipped = false;
  } else if(data.body.packingSlipSkipped != undefined && (data.body.packingSlipSkipped == false || data.body.packingSlipSkipped == "false")) {
    var packingSlipArray = [];
    const packingSlipBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      packingSlipBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          packingSlipArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
        }
      });
    }
    obj.packingSlip = packingSlipArray;
    obj.packingSlipSkipped = false;
  } else if(data.body.cformSkipped != undefined && (data.body.cformSkipped == false || data.body.cformSkipped == "false")) {
    var cformArray = [];
    const cformBody = JSON.parse(data.body.fields);
    for (var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      cformBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          cformArray.push({file:data.files[i], month: element.month, year: element.year});
        }
      });
    }
    obj.cform = cformArray;
    obj.cformSkipped = false;
  } else if(data.body.markSheetSkipped != undefined && (data.body.markSheetSkipped == false || data.body.markSheetSkipped == "false")) {
    var markSheetArray = [];
    const markSheetBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      markSheetBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          markSheetArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
        }
      });
    }
    obj.markSheet = markSheetArray;
    obj.markSheetSkipped = false;
  } else if(data.body.certificateSkipped != undefined && (data.body.certificateSkipped == false || data.body.certificateSkipped == "false")) {
    var certificateArray = [];
    const certificateBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      filePath = '/uploads/documents/'+data.files[i].filename;
      data.files[i].destination = filePath;
      data.files[i].path = filePath;
      certificateBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          certificateArray.push({file:data.files[i], type: element.type, month: element.month, year: element.year});
        }
      });
    }
    obj.certificate = certificateArray;
    obj.certificateSkipped = false;
  } 
  if(data.body.answerSheetSkipped == true || data.body.answerSheetSkipped == 'true') {
    obj.answerSheetSkipped = true;
    obj.answerSheet = [];
  }
  if(data.body.admissionApprovalSkipped == true || data.body.admissionApprovalSkipped == 'true') {
    obj.admissionApprovalSkipped = true;
    obj.admissionApproval = [];
  }
  if(data.body.packingSlipSkipped == true || data.body.packingSlipSkipped == 'true') {
    obj.packingSlipSkipped = true;
    obj.packingSlip = [];
  }
  if(data.body.cformSkipped == true || data.body.cformSkipped == 'true') {
    obj.cformSkipped = true;
    obj.cform = [];
  }
  if(data.body.markSheetSkipped == true || data.body.markSheetSkipped == 'true') {
    obj.markSheetSkipped = true;
    obj.markSheet = [];
  }
  if(data.body.certificateSkipped == true || data.body.certificateSkipped == 'true') {
    obj.certificateSkipped = true;
    obj.certificate = [];
  }
  if(!data.body || (data.body.answerSheetSkipped == undefined && data.body.admissionApprovalSkipped == undefined && data.body.packingSlipSkipped == undefined && data.body.cformSkipped == undefined && data.body.markSheetSkipped == undefined && data.body.certificateSkipped == undefined)) {
    callback('nothing to update');
    return;
  }
  if(data.body && data.body.updatedBy && data.body.updatedBy != "") {
    obj.updatedBy = data.body.updatedBy;
  }
  Candidate.findOneAndUpdate({_id: data.body._id}, {$set: obj}, {new: true}, function(err,res) {
    if(err) {
      callback(err,null)
    } else {
      callback(null,res)
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
