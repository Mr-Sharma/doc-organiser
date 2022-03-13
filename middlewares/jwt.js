var superSecret = "1234567890Test@12345PCB987654321"
var jwt = require('jsonwebtoken')

module.exports = {
    verifyauthentication: verifyauthentication
}

function verifyauthentication(req, res,next) {
  	// check header or url parameters or post parameters for token
    // console.log("token",req.headers["authorization"],req.headers["id"]);

  	var bearerToken;
  	var bearerHeader = req.headers["authorization"];
	var _id = req.headers["id"];

	// decode token
	if (typeof bearerHeader !== 'undefined') {

		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];

		// verifies secret and checks exp
		jwt.verify(bearerToken, superSecret, function(err, decoded) {

			if (err) {
				res.status(401).json({ success: false,message: err.message });
			} else {
				// if everything is good, save to request for use in other routes
				if(_id == null || _id == undefined || _id == "null" || _id == "undefined"){
					res.status(400).json({ success: false, message: "userId required!" });
				}

				if(decoded._id == _id){
					req.decoded = decoded;
					next()
				}else{
					res.status(403).json({success: false,message: 'Invalid userId provided for the token.'});
				}

			}
	 	});
	}else{
		res.status(403).send({success: false,message: 'No token provided.'});
		// if there is no token
		// return an error
	}
}
