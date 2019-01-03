// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, db) => {
    if(err) return console.log('unable to connect to database');
    console.log('connected to MongoDB server');

    //connect to the "Todos" database
    const mydb = db.db('TodoApp');
    
    // mydb.collection('Users').findOneAndUpdate({
    //     name: 'Steven Victor', 
    // },{
    //     $set: {
    //         name: 'Ojo Mike'
    //     }
    // },{
    //     returnOriginal: false

    // })
    // .then(result => {
    //     console.log(result);
    // })

    mydb.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5c2d1ede949eed76c34f3cf5"), 
    },
    //options
    {
        $inc: {
            age: 20
        },
        // $set: {
        //     name: "John Obi"
        // },

        //it updates the name of the 'field'
        $rename: {
            name: "name1"
        }

    },{
        returnOriginal: false
    })
    .then(result => {
        console.log(result);
    }).catch(err => console.log('could not find document'));

    // db.close();

    mydb.collection('Users').find().toArray().then(docs => {
        console.log(docs);
    });
});