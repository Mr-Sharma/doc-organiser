const express = require('express');
var router = express.Router();
var candidate = require('../controllers/candidateController');

router
	.route('/create')
		.put(candidate.create)

router	
	.route('/get/')
		.get(candidate.getAll)

router	
	.route('/getCandidateById/:candidate_id')
		.get(candidate.getCandidateById)

router
	.route('/delete/:candidate_id')
		.delete(candidate.deleteCandidate)

module.exports = router;
