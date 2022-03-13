var sendEmail = require('../middlewares/email');
var USER_EMAIL_TEMPLATE = require('../middlewares/userEmailTemplate');

module.exports.emailUser = function(req,res){//Sends email to the specified user with credentials and RDP file.
	var obj = req.body;
    var receipents = obj.email;
    var subject = "Slot Booking Confirmed";
    var body = EMAIL_TEMPLATE.userEmailTemplate(obj.slotDetails); 
    // var attachments={};
    //attachments.filename= rg.name+".rdp";
    //attachments.filepath=path.join(__dirname,'../public/downloads/rdps',attachments.filename);
    res.status(400).json({success:false,'message':"API NOT IN USE"});

    /*EMAIL.sendAdUserInfo(receipents,subject,body,function(err, info) {
        if (err) {
            res.status(400).json({success:false,'message':err});
        }else{
        	res.status(200).json({success:true,'message':info});
        }
    })*/
    
}

module.exports.sendOtpToEmail = function(data,callback){//Sends email to the specified user with credentials and RDP file.
    var obj = data;
    var receipents = obj.email;
    var subject = "Your One Time Password";
    var body = USER_EMAIL_TEMPLATE.userEmailTemplate(obj.otp);
    var attachments=null;
    var cc=null;
    //attachments.filename= rg.name+".rdp";
    //attachments.filepath=path.join(__dirname,'../public/downloads/rdps',"");
    sendEmail.sendMail(receipents,subject,body,attachments,cc,function(err, info) {
        if (err) {
            callback(err,null)
        }else{
            callback(null,info)
        }
    })

}

module.exports.userCreatedsendEmail = function(data,callback){//Sends email to the specified user with credentials and RDP file.
    var obj = data;
    var receipents = obj.email;
    var subject = "User Successfully Registered";
    var body = USER_EMAIL_TEMPLATE.userCreatedsendEmail(obj);
    var attachments=null;
    var cc=null;
    //attachments.filename= rg.name+".rdp";
    //attachments.filepath=path.join(__dirname,'../public/downloads/rdps',"");
    sendEmail.sendMail(receipents,subject,body,attachments,cc,function(err, info) {
        if (err) {
            callback(err,null)
        }else{
            callback(null,info)
        }
    })

}

module.exports.userUpdatedsendEmail = function(data,callback){//Sends email to the specified user with credentials and RDP file.
    var obj = data;
    var receipents = obj.email;
    var subject = "User Updated Successfully";
    var body = USER_EMAIL_TEMPLATE.userCreatedsendEmail(obj);
    var attachments=null;
    var cc=null;
    //attachments.filename= rg.name+".rdp";
    //attachments.filepath=path.join(__dirname,'../public/downloads/rdps',"");
    sendEmail.sendMail(receipents,subject,body,attachments,cc,function(err, info) {
        if (err) {
            callback(err,null)
        }else{
            callback(null,info)
        }
    })
}