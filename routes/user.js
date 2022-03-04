const express = require('express');
var router = express.Router();
var user = require('../controllers/userController');

router
	.route('/register')
		.post(user.postUser)
router	
	.route('/authenticate')
		.put(user.authenticateUser)
router	
	.route('/update')
		.put(user.updateUser)
router	
	.route('/fetchAllUsers')
			.get(user.fetchAllUsers)
router	
	.route('/fetchUser/:username')
			.get(user.fetchUser)
router	
	.route('/delete/:user_id')
		.delete(user.deleteUser)

module.exports = router;
