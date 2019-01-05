//the default env is production, which for heroku
var env = process.env.NODE_ENV || 'development';
console.log('env *******', env);


if(env === 'development' || env === 'test'){
    //when we require a json, it automaticlly convert to javascript object:
    var config = require('./config.json');
    // console.log(config);

    //Object.keys() gets the object and return it as an array
    var envConfig = config[env];
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });

}
// if(env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }
// //we had already set the test NODE_ENV in our package.json file,
// else if(env === 'test'){
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }