 const bCrypt = require('bcryptjs');
// var bCrypt = require('bcrypt-nodejs');


// var userPassword = generateHash(req.body.password);
//  global.bcr = bcrypt.hash("ankush", 10, (err, hash));


// var generateHash = function (password) {

//   return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

// };

function encryptor(password, encrylen) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(encrylen), null);

};

function decryptor(password, hash) {
  var decryp = bCrypt.compareSync(password, hash, function (err, res) {
    // res == true
  });
  return decryp
};

module.exports = {
  encryptor: encryptor,
  decryptor: decryptor
};