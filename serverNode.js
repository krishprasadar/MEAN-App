const exp = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = exp();
const MongoClient = mongodb.MongoClient;

app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', exp.static('public'));

var db;

MongoClient.connect("mongodb://krishprasadar:mlabdb@ds033076.mlab.com:33076/kpsample", (err, database) => {
    if (err) return console.log(err);
    db = database;
    var port = process.env.PORT || 4000;
    app.listen(port, function () {
        console.log("Listening on port: " + port);
    })
});

app.post('/app/addTodo', (req, res) => {
    db.collection('todos').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        if (result.deletedCount == 1) {
            result.status = 1;
            console.log("Todo successfully added!")
        }
        else {
            result.status = 0;
            console.log("Todo could not be added. Try again!");

        }
        res.json(result)
    });
});

app.post('/app/deleteTodo', (req, res) => {
    var del = {_id: mongodb.ObjectID(req.body._id)};

    db.collection('todos').deleteOne(del, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.deletedCount == 1) {
            result.status = 1;
            console.log("Todo successfully deleted!")
            res.status(200).json(result);
        }
        else {
            result.status = 0;
            console.log("Todo successfully failed!");
            res.status(500).send("FAILURE");
        }
    })
});

app.get('/app/getTodos', (req, res) => {
    db.collection('todos').find().toArray((err, result) => {
        if (err) return console.log(err)

        res.json(result)
    })
});

app.post('/app/updateTodo', (req, res) => {
    var query = {
        _id: mongodb.ObjectID(req.body._id)
    }
    var update = {"$set": {"completed": req.body.completed}};

    db.collection('todos').updateOne(query, update, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.modifiedCount == 1) {
            result.status = 1;
            console.log("Todo successfully updated")
            res.status(200).json(result);
        }
        else {
            result.status = 0;
            console.log("Todo update failed");
            console.log(result);
            res.json(result)
        }
    })
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});






