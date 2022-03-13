module.exports.userEmailTemplate = function(otp){
	var bodyTemplate= 
	`<table border="0" cellpadding="30" cellspacing="0" width="100%">
        <tbody>
            <tr>
                <td valign="top" style="color:#333333;font-family:Lucida Grande,sans-serif;font-size:14px;line-height:22px;text-align:left">
                    <div> 
                        <span style="color:#663333;font-family:Georgia,serif;font-size:30px;font-weight:normal;margin-bottom:10px"></span>
                        <p style="font-family:Century Gothic;font-size:18px;font-weight:normal;margin-bottom:5px">
                            <br/>
                            <br/>
                            <br/>
                            <h1>Your OTP is `+otp+`</h1> 
                            <h3> Please do not share this with anyone.</h3> 
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:18px;font-weight:normal;margin-bottom:3px">Thanks,</span>
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:20px;font-weight:normal;margin-bottom:5px">Our Team</span>
                        </p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>`;
    return bodyTemplate;
}

module.exports.userCreatedsendEmail = function(obj){
    var bodyTemplate= 
    `<table border="0" cellpadding="30" cellspacing="0" width="100%">
        <tbody>
            <tr>
                <td valign="top" style="color:#333333;font-family:Lucida Grande,sans-serif;font-size:14px;line-height:22px;text-align:left">
                    <div> 
                        <span style="color:#663333;font-family:Georgia,serif;font-size:30px;font-weight:normal;margin-bottom:10px"></span>
                        <p style="font-family:Century Gothic;font-size:18px;font-weight:normal;margin-bottom:5px">
                            <br/>
                            <br/>
                            <br/>
                            <h1 style="line-height : 1.5">`+obj.message+`</h1>
                            <h3>`+obj.credentials+`<h3>
                            <h3>`+obj.URL+`</h3> 
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:18px;font-weight:normal;margin-bottom:3px">Thanks,</span>
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:20px;font-weight:normal;margin-bottom:5px">Our Team</span>
                        </p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>`;
    return bodyTemplate;
}

module.exports.bulkUserCreatedsendEmail = function(obj){
    var bodyTemplate= 
    `<table border="0" cellpadding="30" cellspacing="0" width="100%">
        <tbody>
            <tr>
                <td valign="top" style="color:#333333;font-family:Lucida Grande,sans-serif;font-size:14px;line-height:22px;text-align:left">
                    <div> 
                        <span style="color:#663333;font-family:Georgia,serif;font-size:30px;font-weight:normal;margin-bottom:10px"></span>
                        <p style="font-family:Century Gothic;font-size:18px;font-weight:normal;margin-bottom:5px">
                            <br/>
                            <br/>
                            <br/>
                            <h1 style="line-height : 1.5">`+obj.message+`</h1>
                            <ul style='text-transform: capitalize;font-size:16px'>
                                <li>`+obj.courses.join("<br><li>")+`</li>
                            </ul>
                            <h3>`+obj.credentials+`<h3>
                            <h3>`+obj.URL+`</h3> 
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:18px;font-weight:normal;margin-bottom:3px">Thanks,</span>
                            <br/>
                            <span style="font-family:Georgia,serif;font-size:20px;font-weight:normal;margin-bottom:5px">Our Team</span>
                        </p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>`;
    return bodyTemplate;
}