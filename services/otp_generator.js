'strict';
const rn = require('random-number');


function random_num(MIN, MAX) {
    var options = {
        min: MIN,
        max: MAX,
        integer: true
    }
    var num = rn(options);
    return num;
}


module.exports = {
    random_num: random_num,
};


// var square = require('lib').square;
// var diag = require('lib').diag;
// console.log(square(11));
// console.log(diag(4, 3));