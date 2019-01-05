const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var message = "I am user number 3";
var message2 = "I am user numbesdsr 3";


//the result is an object, we convert it to string:
// var hash = SHA256(message).toString();
// var hash2 = SHA256(message2).toString();

// console.log(hash);
// console.log(hash2);

// var data ={
//     id: 4
// };
// var token = {
//     data, 
//     hash: SHA256(JSON.stringify(data) + 'saltieeng').toString()
// }
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'salting').toString();

// if(resultHash === token.hash){
//     console.log('equal')
// }else{
//     console.log('not equal');
// }

var data = {
    id: 10
};
//where 123abc is the users password
// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123absc');
// console.log(decoded);

let password = "123wkmsfw";

//the salt is built into bcrypt, so no need to writing ur own
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });
let hashPassword = '$2a$10$vh4HncFzmdaiKYLAzL.FuuUbVbFKzXbCe8zblS1gGaAyCK/AuGbEqO';

bcrypt.compare(password, hashPassword, (err, res) => {
    console.log(res);
});