const express = require('express');
var router = express.Router();
var constants = require('../lib/constants');
const trade = require('../lib/trade');
router	
	.route('/getAll')
		.get(function(req, res) {
			const tradeList = trade.array || [];
			res.status(constants.TWO_HUNDRED).json({success:true,message:tradeList});
		})

module.exports = router;
