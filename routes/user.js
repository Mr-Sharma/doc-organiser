const express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router
	.route('/create')
		.post(userController.postUser)
router	
	.route('/authenticate')
		.put(userController.authenticateUser)
router	
	.route('/update/:_id')
		.put(userController.updateUser)
router	
	.route('/fetchAllUsers')
			.get(userController.fetchAllUsers)

router	
	.route('/fetchAllUsers/:type')
			.get(userController.fetchAllUsersByType)
			
router	
	.route('/fetchUser/:username')
			.get(userController.fetchUser)

router	
	.route('/fetchUser/phone/:phoneNumber')
			.get(userController.fetchUserByPhone)
router	
	.route('/delete/:_id')
		.delete(userController.deleteUser)

router
	.route('/checkUserPhoneExists/:phoneNumber')
		.get(userController.checkUserPhoneExists)

router
	.route('/phone/sendotp')
	  	.put(userController.sendOtpToPhoneNumberNew)
	  
router
	.route('/phone/resendOtp')
	 	.put(userController.resendOtpThroughPhoneNew)

router
	.route('/phone/verify')
      	.put(userController.verifyOtpThroughPhoneNew)

router
	.route('/phone/register/verify')
		.put(userController.verifyOtpThroughPhoneForRegister)

module.exports = router;
