var express = require('express');
var router = express.Router();
const config = require(__dirname + '/../config/appconfig.json');
const hash = require('../services/encryptor.js');
const jwt = require('../services/jwtokenizer.js');
const vjwt = require('jsonwebtoken');
var db = require('../models');
var token = null;
var logger = require('../services/logger.js');
var log = logger.LOG;

const expressValidator = require('express-validator');
const {
    check,
    validationResult
} = require('express-validator/check');



router.post('/api/signin', [
    check('email').isEmail(),
    check('password').not().isEmpty().withMessage('please enter password'),
], function (req, res, next) {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let session = req.session;
    log.trace(session);
    session = req.body;

    log.info('sign In body ', req.body);

    db.users.findOne({
        where: {
            email_id: req.body.email
        }
    }).then(function (user, err) {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        if (user.session_status !== "ACTIVE") {
            if (!user) {
                // console.log(user);
                return res.status(404).json({
                    auth: false,
                    token: null,
                    error: 'Email id not registered, please register first.'
                });
            } else {

                var passwordIsValid = hash.decryptor(req.body.password, user.password);
                if (!passwordIsValid) {
                    return res.status(401).json({
                        error: "Authentication failed please enter correct password"
                    });
                }
                if (passwordIsValid) {

                    token = jwt.jsonwebtoken({
                        email_id: user.email_id,
                        user_id: user.user_id,
                        user_name: user.full_name
                    }, config.JWT_KEY, config.JWT_VALIDITY);
                    req.session.loggedin = true;
                    req.session.email = user.email_id;
                    req.session.token = token;
                    return user.update({
                        session_status: "ACTIVE",
                    }, {
                        where: {
                            user_id: user.user_id,
                            email_id: req.body.email
                        }
                    }).then(function (result) {
                        //    console.log(" Update -->  " + token);
                        res.status(200).json({
                            message: "Login authentication successful",
                            auth: true,
                            email_id: result.email_id,
                            full_name: result.full_name,
                            token: token,
                            login_status: result.session_status,
                            user_id: result.user_id,
                            session: req.session
                        });
                    });
                } else {

                    res.status(401).json({
                        message: "Authentication failed please check password"
                    });

                }
            }
        } else {
            res.json({
                message: "User already login!"
            })
        }

    });
});



router.get('/api/signout', function (req, res, next) {
    // let user = req.body.email;
    log.info('logout body ', req.body);
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });
    vjwt.verify(token, config.JWT_KEY, function (err, decoded) {

        if (err) {
            log.error("error token authentication ---> ", err);
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        log.info("decoded var", decoded)
        var email_id = decoded.email_id;
        var user_id = decoded.user_id;
        log.info('JWT token Email ID decode --> ', email_id, 'user_id --> ', user_id);

        db.users.findOne({
            where: {
                user_id: user_id,
                email_id: email_id
            }
        }).then(function (user, err) {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            if (user.session_status !== "INACTIVE") {
                if (!user) {
                    // console.log(user);
                    return res.status(404).json({
                        auth: false,
                        token: null,
                        error: 'Email id not registered, please register first.'
                    });
                } else {
                    var logout = {
                        session_status: "INACTIVE"
                    }
                    return user.update(logout, {
                        where: {
                            user_id: user_id,
                            email_id: email_id
                        }
                    }).then(function (log, err) {
                        if (err) {
                            log.error("error in updating status---> ", err);
                            return res.status(404).json({
                                auth: false,
                                token: null,
                                error: 'Unable to logout'
                            });
                        }
                        if (req.session.sid) {

                            res.clearCookie('sid');
                            res.json({
                                message: "User Logout Successfully"
                            });

                        } else {
                            req.session.destroy(function (err) {
                                if (err) {
                                    log.error("error in clearing session---> ", err);
                                }
                                // else {
                                //     // res.redirect('/');
                                // }
                                res.json({
                                    message: "User Logout Successfully"
                                });
                            });
                        }

                    });
                }
            } else {
                res.json({
                    message: "User already logged out!"
                });
            }
        });
    });
});





module.exports = router;