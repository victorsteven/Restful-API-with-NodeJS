const {User} = require('./../models/user');
//lets define a middleware:
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then(user => {
        if(!user){
            //this will run the code in the catch
            return Promise.reject('cant find user with auth code');
        }
        // res.send(user);
        req.user = user;
        req.token = token;
        next();

    }).catch(e => {
        res.status(401).send('not authorized');
    });
}

module.exports = {authenticate};