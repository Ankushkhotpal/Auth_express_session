var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgonlogger = require('morgan');
var bodyparser = require('body-parser');
var app = express();
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

// Including API Route file 
var sessionManagement = require('./services/sessionManagement');
var api_forgotpass = require('./routes/users_forgotPass');
var api_signup = require('./routes/user_signup.js');
var api_signin = require('./routes/user_signIn.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// express inbuilt body parser
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));

// set morgan to log info about our requests for development use.
app.use(morgonlogger('dev'));

// To access views on request
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.json());
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json({
    type: 'application/vnd.api+json'
}));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
app.use(bodyparser.text());

// session will not work for static content
app.set('trust proxy', 1) // trust first proxy
app.use(sessionManagement);


// Setting cores 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, x-Requested-with, Content-Typrool, Accept, x-access-token, Authorization, Authid"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, PATCH, GET');
        return res.status(200).json({});
    } else {
        next();
    }
});





app.use('/', api_signup);
app.use('/', api_forgotpass);
app.use('/', api_signin);

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;