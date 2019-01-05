var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

//let add INSTANCE METHODS:
//they have access to the individual document 

//now, the response from the response below will render in json, and it gives all the info about the user including the tokens object, but we dont want to include that so we overide the toJSON method:

UserSchema.methods.toJSON = function(){
    let user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);

}

//since array function do not bind the "this" keyword, we will not be using it, we use normal function:
UserSchema.methods.generateAuthToken = function(){
    //remember we are accessing each document(row) here.
    //so lets save each user in the user variable
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    //this first return is because we will be calling a then in server.js
    return user.save().then(() => {
        return token; //the value will be passed as the success argument for the next then call
    });
}

UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        //the pull is used to remove the token value specified
        $pull: {
            tokens: {
                token: token
            }
        }
    });
}

//lets define a MODEL METHOD:
//we will be using "statics" keyword instead of "methods":
UserSchema.statics.findByToken = function(token){
    //assigning the this to the model method:
    var User = this;

    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('the decoded: ', decoded);
    }catch(e){
        //this promise will get resolved by findByToken method in server.js
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    //we use quotes below because of the dots we have in the keys
    //we return this so that we can use "then" in the server.js
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

UserSchema.statics.createCredentials = function(email, password){
    var User = this;

    return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject();
        }
        //And need to compare the password passed above with the one in our database. since bcrypt dont support promises, we will wrap it around promise:
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });
            
        });
    });

}

//lets use a mongoose middleware "pre" to hash the password before it is saved in the database:
UserSchema.pre('save', function(next){
    let user = this;
    //now we check if the password was modified, only then can the new result be hashed:
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
            next();
            })
        })
    }else{
        next();
    }
}); 

var User = mongoose.model('User', UserSchema);

// var newUser = new User({email: 'vic@gmail.com'});

// newUser.save().then(ans => {
//     console.log('user saved', ans)
// }).catch(err => console.log('unable to save', err));

module.exports = {
    User
}