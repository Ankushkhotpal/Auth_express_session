'strict';
const rn = require('random-number');
const uniqueRandom = require('unique-random');

function random_num(MIN, MAX) {
    var options = {
        min: MIN,
        max: MAX,
        integer: true
    }
    var num = rn(options);
    return num;
}



const rand = uniqueRandom(1, 50);
// const rand = random_num(1, 10);
// console.log(rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand());

console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());
console.log(rand());

module.exports = {
    random_num: random_num,
};


// var square = require('lib').square;
// var diag = require('lib').diag;
// console.log(square(11));
// console.log(diag(4, 3));