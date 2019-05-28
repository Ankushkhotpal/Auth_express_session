const express = require('express');
const router = express.Router();
const db = require('../models');
const hash = require('../services/encryptor.js');
const logger = require('../services/logger.js');
var log = logger.LOG;
const expressValidator = require('express-validator');
const {
    check,
    validationResult
} = require('express-validator/check');



router.post('/api/signup', [
            check('email').not().isEmpty().isEmail(),
            check('password').not().isEmpty().withMessage('please enter password'),
            check('full_name').not().isString()
        ], function (req, res, next) {
    // let user = req.body.email;
// Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(422).json({
        errors: errors.array()
    });
}
    db.users.findOne({
        where: {
            email_id: req.body.email,
        }
    }).then(function (user) {
        if (user) {
            if (user.email_id === req.body.email) {
                log.info('User already exists for provided email => ', req.body.email);
                return res.status(401).json({
                    error: 'User already exists.'
                });
            }

        } else {
            var userPassword = hash.encryptor(req.body.password, 10);
            log.info(`encrypted password for provided email_id - ${req.body.email} ---->`, userPassword);
            var data = {
                email_id: req.body.email,
                password: userPassword,
                full_name: req.body.full_name,
                session_status: "INACTIVE"
            };
            log.info("SignUp body to insert",data);
            return db.users.create(data).then(result => {

                res.status(201).json({
                    // const response = {
                    message: "Registered Successfully.",
                    full_name: result.full_name,
                    password: result.password,
                    session_status: result.session_status,
                    // request: {
                    //     type: `GET`,
                    //     url: `http://localhost:3002/mash/candi/signup/` + result.candi_id
                    // }
                });
            }).catch(err => {
                log.error("error in creating user record ---> ", err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
});


module.exports = router;