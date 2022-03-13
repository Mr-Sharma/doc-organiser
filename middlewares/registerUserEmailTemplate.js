
module.exports.adminCreatedSendEmail = function(obj){
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
                            <h2 style="line-height : 1.5;font-family:Georgia,serif;">`+obj.message+`</h4>
                            <h4 style="line-height : 1.5;font-family:Georgia,serif;">URL: `+obj.URL+`</h4> 
                            <h4 style="line-height : 1.5;font-family:Georgia,serif;">Email: `+obj.email+`</h4> 
                            <br/>
                            <span style="font-family:sans-serif,serif;font-size:18px;font-weight:normal;margin-bottom:3px">Thanks,</span>
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

module.exports.subAdminCreatedSendEmail = function(obj){
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
                            <h2 style="line-height : 1.5;font-family:Georgia,serif;">`+obj.message+`</h4>
                            <h4 style="line-height : 1.5;font-family:Georgia,serif;">URL: ` + obj.URL+`</h4> 
                            <h4 style="line-height : 1.5;font-family:Georgia,serif;">Email: ` +obj.email+`</h4> 
                            <br/>
                            <span style="font-family:sans-serif,serif;font-size:18px;font-weight:normal;margin-bottom:3px">Thanks,</span>
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