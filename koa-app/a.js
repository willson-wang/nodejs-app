var jwt = require('jsonwebtoken');
const signKey = 'abcncn'
var token = jwt.sign({a: 1}, signKey, {expiresIn: "10h"});

console.log('token', token);



jwt.verify(token, signKey, function (err, decoded) {
    // decoded.exp - decoded.iat 秒数
    console.log(err, decoded, decoded.exp - decoded.iat);
});

setTimeout(() => {
    jwt.verify(token, signKey, function (err, decoded) {
        console.log('1s 后', err, decoded);
    });
}, 3000)