// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: "John", age: 23}
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) return console.log('unable to connect to database');
    console.log('connected to MongoDB server');

    //connect to the "Todos" database
    const mydb = db.db('TodoApp');
    //fetching all the data from the Todos table
    // mydb.collection('Todos').find().toArray().then(docs => {
    //     console.log("Todos")
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch(err => console.log(err));

    // //quering our database table: 
    // mydb.collection('Todos').find({completed: false}).toArray().then(docs => {
    //     console.log("Todos")
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch(err => console.log(err));
    
    //quering our database table by ID: 
    // mydb.collection('Todos').find({_id: new ObjectID('5c2d1b934e6cf87610b641d8')}).toArray().then(docs => {
    //     console.log("Todos")
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch(err => console.log(err));

    //counting the number of documents in the collection
    // mydb.collection('Todos').find().count().then(count => {
    //     // console.log("Todos")
    //     console.log(count);
    // }).catch(err => console.log(err));

    // //use forEach to print particular value from each object
    // mydb.collection('Todos').find().forEach(todo => {
    //     console.log(todo.text);
    // });

    // //quering our database table: 
    // mydb.collection('Users').find({name: 'Steven Victor'}).toArray().then(user => {
    //     console.log("USers")
    //     console.log(JSON.stringify(user, undefined, 2));
    // }).catch(err => console.log(err));

    //NOTE, this will give an error, we need the toArray() which enable us to return a promise, because find() only returns a cursor
    // mydb.collection('Users').find({name: 'Steven Victor'}).then(user => {
    //     console.log("USers")
    //     console.log(JSON.stringify(user, undefined, 2));
    // }).catch(err => console.log(err));
    
    // db.close();
});