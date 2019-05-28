var excel = require('exceljs');
var tempfile = require('tempfile');
var nodemailer = require('nodemailer');
var logger = require('./logger.js');

var log = logger.LOG;

var workbook = new excel.Workbook(); //creating workbook

var xlsxfile = null;

function createXLSX(FROM_EMAIL, EMAIL_TO, EMAIL_PASS, FILEPATH, SHEETNAME, FILENAME, ROWARRAY) {
    var DATE = new Date();
    workbook.creator = 'MineMark Solutions';
    workbook.lastModifiedBy = 'Ankush Khotpal';
    workbook.created = DATE;
    workbook.modified = DATE;
    workbook.lastPrinted = DATE;

    workbook.views = [{
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible'
    }]

    var worksheet = workbook.addWorksheet(SHEETNAME, {
        pageSetup: {
            paperSize: 9,
            orientation: 'landscape'
        }
    }); //creating worksheet
    // worksheet.getRow('1R').border = {
    //     top: {
    //         style: 'double',
    //         color: {
    //             argb: 'FF00FF00'
    //         }
    //     },
    //     left: {
    //         style: 'double',
    //         color: {
    //             argb: 'FF00FF00'
    //         }
    //     },
    //     bottom: {
    //         style: 'double',
    //         color: {
    //             argb: 'FF00FF00'
    //         }
    //     },
    //     right: {
    //         style: 'double',
    //         color: {
    //             argb: 'FF00FF00'
    //         }
    //     }
    // };

    worksheet.addRow().values = Object.keys(ROWARRAY[0]);
    for (let index = 0; index < ROWARRAY.length; index++) {
        const element = ROWARRAY[index];
        worksheet.addRow().values = Object.values(element);
        log.info('xlsxGenerator File Line no 40', element);
    }


    // worksheet.addRow(objArray).commit();


    // var tempFilePath = tempfile('Report' + '_' + FILENAME + DATE.getDate() + '-' + DATE.getMonth() + '-' + DATE.getFullYear() + '_' + DATE.getTime() + '.xlsx');
    // console.log("tempFilePath : ", tempFilePath);
    xlsxfile = __dirname + FILEPATH + '/' + 'Report' + '_' + FILENAME + DATE.getDate() + '-' + DATE.getMonth() + '-' + DATE.getFullYear() + '_' + DATE.getTime() + '.xlsx';

    workbook.xlsx.writeFile(__dirname + FILEPATH + '/' + 'Report' + '_' + FILENAME + DATE.getDate() + '-' + DATE.getMonth() + '-' + DATE.getFullYear() + '_' + DATE.getTime() + '.xlsx').then(function (data) {
        // res.sendFile(data, function (data, err) {
        //     if (error) {
        //         log.error('---------- error downloading file: ', err);
        //     }
        //     if (data) {
        //         log.info('Temprory file generated successfuly....', data);
        //     }
        // });
        // console.log('Report' + '_' + FILENAME + DATE.getDate() + '-' + DATE.getMonth() + '-' + DATE.getFullYear() + '_' + DATE.getTime() + '.xlsx');
        // console.log('file is', xlsxfile.replace(/\\/g, "/"));
        // log.info('file is written')
        // return xlsxfile
        // console.log(xlsxfile);

        var transporter = nodemailer.createTransport({
            host: 'server38.hostingraja.in',
            port: 465,
            secureConnection: true,
            auth: {
                user: FROM_EMAIL,
                pass: EMAIL_PASS
            }
        });


        var mailOptions = {
            from: FROM_EMAIL,
            to: EMAIL_TO,
            subject: 'Mangalam Assessment Report',
            // text: 'MineMark OTP for forgot password ' + random_otp,

            html: '<b><h2 class="text-center"> <p>Mangalam Assessment Report</p> </h2><h class="text-center">Please, find attached report file</h2></b><br><p style="align:center"></p><p> Thanks for giving your Assessment.</p> ',
             
            attachments: [
                
                // { // utf-8 string as an attachment
                //     fileName: "text1.txt",
                //     contents: "hello world!"
                // },
                // { // binary buffer as an attachment
                //     fileName: "text2.txt",
                //     contents: new Buffer("hello world!", "utf-8")
                // },
                //  { // file on disk as an attachment
                    //  'filename': '../Generated_docs/Report_Ankush Khotpal22-0-2019_1548166831405.xlsx', 'content': data
                      // stream this file
                // },
                // { // fileName and content type is derived from filePath
                //     filePath: "/path/to/file.txt"
                // },
                { // stream as an attachment
                    // fileName: 'Report' + '_' + FILENAME + DATE.getDate() + '-' + DATE.getMonth() + '-' + DATE.getFullYear() + '_' + DATE.getTime() + '.xlsx',
                    path: xlsxfile.replace(/\\/g, "/")
                },
                // { // define custom content type for the attachment
                //     fileName: "text.bin",
                //     contents: "hello world!",
                //     contentType: "text/plain"
                // },
                // { // use URL as an attachment
                //     fileName: "license.txt",
                //     filePath: "https://raw.github.com/andris9/Nodemailer/master/LICENSE"
                // }
            ]

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                log.error(error);
            } else {
                log.info('Email sent: ' + info.response);
            }
        });


    });


}

module.exports = {
    createXLSX: createXLSX,
};