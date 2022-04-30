const express = require('express');
var router = express.Router();
var candidate = require('../controllers/candidateController');
var multer = require('multer');
var path = require('path');
var uniqid = require('uniqid');

var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, path.join(__dirname,'../uploads/documents'));
	},
	filename: function (req, file, callback) {
		var filename = uniqid();
		callback(null, filename);
	}
});

var upload = multer({ storage: storage });

router
	.route('/create')
		.post(candidate.create)

router
	.route('/update')
		.put(candidate.update)

router
	.route('/upload')
		.put(upload.array('files'), candidate.uploadFile)
		
router	
	.route('/get')
		.get(candidate.getAll)

router	
	.route('/getCandidateById/:candidate_id')
		.get(candidate.getCandidateById)

router
	.route('/delete/:candidate_id')
		.delete(candidate.deleteCandidate)

router
	.route('/download/:roll_number')
		.get(candidate.downloadCertificate)

module.exports = router;
