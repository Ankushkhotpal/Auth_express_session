const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require(__dirname + '/../config/appconfig.json');
const otp = require('../services/otp_generator.js');
const JWT = require('../services/jwtokenizer');
const hash = require('../services/encryptor.js');
var logger = require('../services/logger.js');
var log = logger.LOG;

var token = null;



// Forgot password send OTP to mail 
router.post('/api/forgot_password', function (req, res) {

    db.users.findOne({
        where: {
            email_id: req.body.email,
        }
    }).then(function (user) {

        if (user) {
            var random_otp = otp.random_num(1000, 9999);

            token = JWT.jsonwebtoken({
                email: user.email_id,
                user_id: user.user_id
            }, config.JWT_KEY, config.JWT_VALIDITY);

            let session = req.session;
            log.trace(session);
            session = token;

            log.info('Forgot password body ', req.body);
            log.trace('Forgot password otp --> ', random_otp);

            return user.update({
                email_otp: random_otp,
                otp_verify_status: "UNVERIFIED"
            }, {
                where: {
                    candi_email: req.body.email
                }
            }).then(function (result) {
                //    console.log(" Update -->  " + token);
                res.json({
                    email: result.email_id,
                    email_otp: result.email_otp,
                    otp_valid: result.otp_verify_status,
                    token: token,
                    message: "OTP send it to registered email."
                });

                var transporter = nodemailer.createTransport({
                    service: config.EMAIL_SERVICE,
                    auth: {
                        user: config.FROM_EMAIL,
                        pass: config.EMAIL_PASS
                    }
                });


                var mailOptions = {
                    from: config.FROM_EMAIL,
                    to: user.email_id,
                    subject: 'Forgot Password OTP',
                    // text: 'MineMark OTP for forgot password ' + random_otp,

                    html: '<b><h2 class="text-center">Verify your Email</h2><br><p style="align:center"></p><p> Thanks for giving your details.</p> <p> Please enter the 4 digit OTP below for Successful Registration</p><h2 class="text-center"> Your OTP number is  ' + random_otp + '</h2></b>'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        log.error("Error in sending email --> ", error);
                    } else {
                        log.info('Email sent: ' + info.response);
                    }
                })

            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        } else {
            return res.status(404).json({
                message: "Email address does not exits"
            });
        }
    });

});


// Forgot password verify OTP to mail
router.post('/api/verify_password', function (req, res) {

    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];

    if (!token)
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    log.info("Forgot password token ", token);
    jwt.verify(token, config.JWT_KEY, function (err, decoded) {

        if (err) {
            // log.
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        var email = decoded.email;
        log.info("id from token " + email);

        db.users.findOne({
            where: {
                email_id: email,
            }
        }).then(function (user) {
            // console.log("JWT TOKEN --> " + user.candi_forgotpass_token);
            if (!user.email_id) {
                log.error("Email does not exist");
                return res.status(401).send({
                    message: "Email address does not exits"
                });
            }

            log.info("otp stored in table ", user.email_otp);

            if (user.email_otp === req.body.email_otp) {

                return user.update({
                    // email_otp: req.body.email_otp,
                    otp_verify_status: "VERIFIED"
                }, {
                    where: {
                        email_id: email
                    }
                }).then(function (result) {
                    //    console.log(" Update -->  " + token);
                    res.json({
                        email: result.email_id,
                        email_otp: result.email_otp,
                        verification_status: result.otp_verify_status,
                        message: "OTP matched successfully",

                    });
                });

            } else {
                return res.status(500).send({
                    message: "Please enter correct otp"
                });
            }
        });
    });
});


// Update user new password
router.put('/api/newpassword', function (req, res) {

    // let email = req.body.candi_email;
    // let password = req.body.candi_password;

    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token)
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token, config.JWT_KEY, function (err, decoded) {
        // console.log("decoded output "+ decoded);

        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        var email = decoded.email;
        console.log("email from token " + email);

        db.users.findOne({
            where: {
                email_id: email,
            }
        }).then(function (user) {
            if (user.otp_verify_status === "VERIFIED") {
                if (!user.email_id) {
                    return res.status(401).send({
                        message: "Email address does not exits"
                    });
                }
                var newPassword = hash.encryptor(req.body.new_password, 10);

                return user.update({
                    password: newPassword,
                    // candi_forgotpass_token: null,
                    email_otp: null,
                    otp_verify_status: "PENDING"
                }, {
                    where: {
                        email_id: email
                    }
                }).then(function (result, error) {
                    // console.log(result);
                    if (error) {
                        res.status(500).json({
                            error: false,
                            message: 'user password not updated.'
                        });
                    }
                    if (req.session.sid) {

                        res.clearCookie('sid');
                        res.json({
                            message: 'user password has updated successfully.',
                        });

                    } else {
                        req.session.destroy(function (err) {
                            if (err) {
                                log.error("error in clearing session---> ", err);
                            }

                            return res.status(200).json({
                                // new_password: result.password, 
                                message: 'user password has updated successfully.',
                                // success: 'Welcome to the JWT Auth',

                            });
                        });
                    }
                });
            } else if (user.otp_verify_status === "UNVERIFIED") {

                res.json({
                    error: false,
                    message: 'user password not verified.'
                });
            } else {
                res.json({
                    error: false,
                    message: 'All ready new password set with email otp verification'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });

    });
});



module.exports = router;