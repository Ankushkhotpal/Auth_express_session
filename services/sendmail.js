const nodeMailer = require('nodemailer');


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         // user: 'shanky02051997@gmail.com',
//         // pass: 'MineMarkShanky'
//         user: 'minemarkdb@gmail.com',
//         pass: 'minemark@minemark'
//         // user: '.env',
//             // pass: '.env'
//     }
// });

// console.log('CANDI_EMAIL ' + user.CANDI_EMAIL);

// var mailOptions = {
//     from: 'minemarkdb@gmail.com',
//     // from: "user.env",
//     to: user.CANDI_EMAIL,
//     subject: 'Minemark OTP',
//     text: 'Minemark OTP forgot password for candidate ' + random_otp,

//     html: '<b><h2 class="text-center">Verify your mobile number & Email</h2><br><p style="align:center"></p><p> Thanks for giving your details. An OTP has been sent to your Mobile Number and Email Id. Please enter the 4 digit OTP below for Successful Registration</p><h2 class="text-center"> Your OTP number is  ' + random_otp + '</h2></b>'
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });


// sendmail(email_to, mail_subject, _htmlfile);





var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;


var sender = 'smtps://minemarkdb%40gmail.com' // The emailto use in sending the email(Change the @ symbol to %40 or do a url encoding )
var password = 'minemark@minemark' // password of the email to use
var transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');
// var transporter = nodemailer.createTransport(config);

var templateDir = path.join(__dirname, '/template/resetPassword', 'subdir');
var template = new EmailTemplate(templateDir)
var username = 'Ankush';


var transport = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com')
template.render(locals, function (err, results) {
    if (err) {
        return console.error(err)
    }
    // replace values in html template
    console.log('template render')
    console.log(err);

    // default is results.html in this case
    // read template and replace desired values
    var res1 = results.html.toString();
    var str = res1.replace('__username__', username);
    console.log(str);
    console.log('end template render')

    transport.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'subject',
        html: str,
        text: results.text
    }, function (err, responseStatus) {
        if (err) {
            return console.error(err)
        }
        console.log(responseStatus)
    })
})