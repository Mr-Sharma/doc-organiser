const express = require('express');
var router = express.Router();
var company = require('../controllers/companyController');

router
	.route('/documents/:rollNumber')
		.get(company.getDocuments)

module.exports = router;
