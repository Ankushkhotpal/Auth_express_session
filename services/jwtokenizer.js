'strict';
const jwt = require('jsonwebtoken');


function jsonwebtoken(payload, secretkey, timeout) {

 const token = jwt.sign(payload,
     secretkey, {
         expiresIn: timeout
     }
 );
    return token;
}


// var jwt = require('jwt-simple');

// var payload = { userId: 1 };
// var secret = 'fe1a1915a379f3be5394b64d14794932';
// global.token = jwt.encode(payload, secret);

// global.decodetoken = jwt.decode(token, secret);



// console.log(token);
// console.log("-------------------------------------");
// console.log(decodetoken);

// function jsonwebtoken(token, secretkey, timeout) {
// jwt.verify(token, secretkey, function (err, decoded) {
//     if (err)
//         return res.status(500).send({
//             auth: false,
//             message: 'Failed to authenticate token.'
//         });
//     // db.exam_question.update({
//     //     answer: req.body.answer
//     // }, {
//     //     where: {
//     //         id: req.body.id
//     //     }
//     // }).then(function (result) {
//     //     res.json(result);
//     // });
// });
// }



module.exports = {
    jsonwebtoken: jsonwebtoken,
};


// var tokendata = {
//     email: "ankush.khotpal@minemarksolutions.com",
//     userId: "CAN001"
// };
// console.log("TOKEN " + jsonwebtoken(tokendata, "khotpal" , "1h"));