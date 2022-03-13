const sgMail = require('@sendgrid/mail');
var smtpPool = require('nodemailer-smtp-pool');
var USER_EMAIL_TEMPLATE = require('../middlewares/adUserEmailTemplate')

module.exports={
  sendMultipleEmail: sendMultipleEmail,
  sendMultipleEmailForEndUsers:sendMultipleEmailForEndUsers
}
 
function sendMultipleEmail(req, callback){
    // SENDGRID_API_KEY='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'
    // sgMail.setApiKey(SENDGRID_API_KEY);
    // console.log("req for email",req)
    // const msg = {
    //   to: req.email,
    //   from: 'no-reply@platifi.com',
    //   subject: 'User Successfully Registered',
    //   html: USER_EMAIL_TEMPLATE.userCreatedsendEmail(req)
    // };
    // sgMail.send(msg,function(err,response){
    //   if(err){
    //     //console.log("err",err)
    //     callback(err,null)
    //   }else{
    //     //console.log("data")
    //     callback(null,"email sent")
    //   }
    // })

    // credentials
    var username = "testchampsdev@gmail.com";
    var password = "Bangal0RE"

    // create reusable transporter object using the default SMTP transport
    //var transporter = nodemailer.createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com');
    var transporter = nodemailer.createTransport(smtpPool({
        service:'Gmail',
        auth: {
            user: username, // generated ethereal user
            pass: password // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    }));

    // setup e-mail data with unicode symbols
    var mailOptions = {
      to: req.email,
      from: 'testchampsdev@gmail.com',
      subject: 'User Successfully Registered',
      html: USER_EMAIL_TEMPLATE.userCreatedsendEmail(req)
    };

    if(cc){
      mailOptions.cc=cc; 
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info) {
        callback(err, info);
    });
}

function sendMultipleEmailForEndUsers(req){
    return new Promise(function(resolve,reject){
        // SENDGRID_API_KEY='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'
        // sgMail.setApiKey(SENDGRID_API_KEY);
        // const msg = {
        //   to: req.email,
        //   from: 'no-reply@platifi.com',
        //   subject: 'User Successfully Registered',
        //   html: USER_EMAIL_TEMPLATE.bulkUserCreatedsendEmail(req)
        // };
        // sgMail.send(msg,function(err,response){
        //     if(err){
        //       reject(err)
        //     }else{
        //       resolve("email sent")
        //     }
        // })

        // credentials
        var username = "testchampsdev@gmail.com";
        var password = "Bangal0RE"

        // create reusable transporter object using the default SMTP transport
        //var transporter = nodemailer.createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com');
        var transporter = nodemailer.createTransport(smtpPool({
            service:'Gmail',
            auth: {
                user: username, // generated ethereal user
                pass: password // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        }));

        // setup e-mail data with unicode symbols
        var mailOptions = {
          to: req.email,
          from: 'testchampsdev@gmail.com',
          subject: 'User Successfully Registered',
          html: USER_EMAIL_TEMPLATE.bulkUserCreatedsendEmail(req)
        };

        if(cc){
          mailOptions.cc=cc; 
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(err, info) {
          if(err){
            reject(err)
          }else{
            resolve("email sent")
          }
        });

    })
}
