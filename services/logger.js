var log4js = require('log4js');


// log4js.configure({
//             appenders: {
//                 out: {
//                     type: 'console'
//                 },
//                 task: {
//                     type: 'dateFile',
//                     filename: 'logs/task',
//                     "pattern": "-dd.log",
//                     alwaysIncludePattern: true
//                 },
//                 result: {
//                     type: 'dateFile',
//                     filename: 'logs/result',
//                     "pattern": "-dd.log",
//                     alwaysIncludePattern: true
//                 },
//                 error: {
//                     type: 'dateFile',
//                     filename: 'logs/error',
//                     "pattern": "-dd.log",
//                     alwaysIncludePattern: true
//                 },
//                 default: {
//                     type: 'dateFile',
//                     filename: 'logs/default',
//                     "pattern": "-dd.log",
//                     alwaysIncludePattern: true
//                 },
//                 rate: {
//                     type: 'dateFile',
//                     filename: 'logs/rate',
//                     "pattern": "-dd.log",
//                     alwaysIncludePattern: true
//                 }
//             },
//             categories: {
//                 default: {
//                     appenders: ['out', 'default'],
//                     level: 'info'
//                 },
//                 task: {
//                     appenders: ['task'],
//                     level: 'info'
//                 },
//                 result: {
//                     appenders: ['result'],
//                     level: 'info'
//                 },
//                 error: {
//                     appenders: ['error'],
//                     level: 'error'
//                 },
//                 rate: {
//                     appenders: ['rate'],
//                     level: 'info'
//                 }
//             }
//         });



log4js.configure({
    appenders: {
        test: {
            type: 'dateFile',
            filename: 'logs/test',
            "pattern": "-dd-MM-yyyy.log",
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: ['test'],
            level: 'info'
        }
    }

});

var logger = log4js.getLogger('test');
// logger.setLevel('DEBUG');
Object.defineProperty(exports, "LOG", {
    value: logger,
});