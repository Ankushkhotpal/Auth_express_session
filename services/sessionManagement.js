var session = require('express-session');
var Sequelize = require('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
// var env = process.env.NODE_ENV || 'development',
//     config = require('./../config/config.' + env);
const appcon = require(__dirname + '/../config/appconfig.json');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];


const sequelizeParams = {
    host: config.host,
    dialect: config.dialect,
};

//
// Session configuration
//
var sequelizeSessionDB = new Sequelize(config.database, config.username, config.password, sequelizeParams);

var mySessionStore = new SequelizeStore({
    db: sequelizeSessionDB
});

// make sure that Session tables are in place
mySessionStore.sync();

module.exports = session({
    secret: appcon.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mySessionStore,
    cookie: {
        secure: false, // if true requires HTTPS connection
        maxAge: 60000 // session expires in milliseconds
    }
});



// var connect = require('connect')
//     // for express, just call it with 'express'
//     ,
//     SequelizeStore = require('connect-session-sequelize')(connect);

// connect().use(connect.session({
//     store: new SequelizeStore(options),
//     secret: 'CHANGEME'
// }));


// initialize express-session to allow us track the logged-in user across sessions.
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // if true requires HTTPS connection
//         maxAge: 60000
//     }

// }));