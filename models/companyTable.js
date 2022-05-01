
var Candidate = require('./candidate');
var Log = require('./log');
var multer  =   require('multer');
var path = require('path');
var uniqid = require('uniqid');
var fs = require('fs');
var pdf = require('html-pdf');


module.exports = {
  getDocuments:getDocuments
}

function getDocuments(rollNumber,callback){
  Candidate.findOne({rollNumber:rollNumber}).
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
