var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
// const sgMail = require('@sendgrid/mail');

module.exports = {
    sendMail: sendMail,
    sendMailWithAttachments:sendMailWithAttachments,
}

function sendMail(recipients, subject, body, attachments, cc, callback) {
    //registered email : shreya@platifi.com
    //password : Shreya@9164
    // if(attachments){
    //     attachments=
    //     [{   // use URL as an attachment
    //         filename: attachments.filename,
    //         path: attachments.filepath
    //     }
    //     ]
    // }else{
    //     attachments=[]
    // }
    // //SENDGRID_API_KEY='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' //shreya's
    // sgMail.setApiKey(SENDGRID_API_KEY);
    // const msg = {
    //   to: recipients,
    //   from: 'no-reply@platifi.com',
    //   subject: subject,
    //   html: body,
    //   attachments:[],
    //   cc:cc
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
    var username = "dev@gmail.com";
    var password = "dev"

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


if(attachments){
        attachments=
        [{   // use URL as an attachment
            filename: attachments.filename,
            path: attachments.filepath
        }
        ]
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'dev%40gmail.com', // sender address
        to: recipients, // list of receivers
        subject: subject, // Subject line
        html: body ,
        attachments:attachments
    };

    if(cc){
       mailOptions.cc=cc; 
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info) {
        callback(err, info);
    });
}

function sendMailWithAttachments(recipients, subject, body, attachments, cc, callback) {
    //registered email : shreya@platifi.com
    //password : Shreya@9164
    // SENDGRID_API_KEY='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'
    // sgMail.setApiKey(SENDGRID_API_KEY);
    // const msg = {
    //   to:recipients,
    //   from: 'no-reply@platifi.com',
    //   subject: subject,
    //   html: body,
    //   attachments:[],
    //   cc:cc
    // };
    // sgMail.send(msg,function(err,response){
    //   if(err){
    //     callback(err,null)
    //   }else{
    //     //console.log("data")
    //     callback(null,"email sent")
    //   }
    // })
    // credentials
    var username = "dev@gmail.com";
    var password = "dev"

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


if(attachments){
        attachments=attachments
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'dev%40gmail.com', // sender address
        to: recipients, // list of receivers
        subject: subject, // Subject line
        html: body ,
        attachments:attachments
    };

    if(cc){
       mailOptions.cc=cc; 
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info) {
        callback(err, info);
    });
}