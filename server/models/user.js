var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
})

// var newUser = new User({email: 'vic@gmail.com'});

// newUser.save().then(ans => {
//     console.log('user saved', ans)
// }).catch(err => console.log('unable to save', err));

module.exports = {
    User
}