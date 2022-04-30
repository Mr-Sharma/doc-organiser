
var Candidate = require('./candidate');
var Log = require('./log');
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
  deleteCandidate:deleteCandidate,
  downloadCertificate:downloadCertificate
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
      answerSheetBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          answerSheetArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
          data.files.splice(i,1)
        }
      });
    }
    obj.answerSheet = answerSheetArray;
    obj.answerSheetSkipped = false;
  } else if(data.body.admissionApprovalSkipped != undefined && (data.body.admissionApprovalSkipped == false || data.body.admissionApprovalSkipped == "false")) {
    var admissionApprovalArray = [];
    const admissionApprovalBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      admissionApprovalBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          admissionApprovalArray.push({file:data.files[i], trade: element.trade, month: element.month, year: element.year});
          data.files.splice(i,1)
        }
      });
    }
    obj.admissionApproval = admissionApprovalArray;
    obj.admissionApprovalSkipped = false;
  } else if(data.body.packingSlipSkipped != undefined && (data.body.packingSlipSkipped == false || data.body.packingSlipSkipped == "false")) {
    var packingSlipArray = [];
    const packingSlipBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      packingSlipBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          packingSlipArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
          data.files.splice(i,1)
        }
      });
    }
    obj.packingSlip = packingSlipArray;
    obj.packingSlipSkipped = false;
  } else if(data.body.cformSkipped != undefined && (data.body.cformSkipped == false || data.body.cformSkipped == "false")) {
    var cformArray = [];
    const cformBody = JSON.parse(data.body.fields);
    for (var i=0; i<data.files.length;i++) {
      cformBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          cformArray.push({file:data.files[i], month: element.month, year: element.year});
          data.files.splice(i,1)
        }
      });
    }
    obj.cform = cformArray;
    obj.cformSkipped = false;
  } else if(data.body.markSheetSkipped != undefined && (data.body.markSheetSkipped == false || data.body.markSheetSkipped == "false")) {
    var markSheetArray = [];
    const markSheetBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      markSheetBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          markSheetArray.push({file:data.files[i], subject: element.subject, month: element.month, year: element.year});
          data.files.splice(i,1)
        }
      });
    }
    obj.markSheet = markSheetArray;
    obj.markSheetSkipped = false;
  } else if(data.body.certificateSkipped != undefined && (data.body.certificateSkipped == false || data.body.certificateSkipped == "false")) {
    var certificateArray = [];
    const certificateBody = JSON.parse(data.body.fields);
    for(var i=0; i<data.files.length;i++) {
      certificateBody.forEach(element => {
        if(data.files[i].originalname == element.fileName) {
          filePath = '/uploads/documents/'+data.files[i].filename;
          data.files[i].destination = filePath;
          data.files[i].path = filePath;
          certificateArray.push({file:data.files[i], type: element.type, month: element.month, year: element.year});
          data.files.splice(i,1)
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
      callback(err,null);
    } else {
      createLog(data.body._id, obj);
      callback(null,res)
    }
  })
}

function createLog(candidateId, obj) {
  Candidate.findOne({_id:candidateId}).
  exec(function(err, respose) {
      var data = {};
      data.name = respose.name;
      data.rollNumber = respose.rollNumber;
      data.candidateId = candidateId;
      data.updatedBy = obj.updatedBy;
      var keys = Object.keys(obj);
      var document = null
      for(var i = 0; i < keys.length;i++){
        if(keys[i].includes('Skipped')) {
          document = keys[i].replace('Skipped','');
          type = keys[i];
        }
      }
      data.data = obj[document] || [];
      data.document = document;
      data.skipped = obj[type];
      Log.create(data);
  });
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

function downloadCertificate(data,callback){
  const roll_number = data.roll_number;
  Candidate.findOne({rollNumber:roll_number}).
  exec(function(err, res) {
    if (err) {
      callback(err,null)
    } else if(res==null){
      callback(err,null);
    } else {
      callback(null,res);
    }
  });
}