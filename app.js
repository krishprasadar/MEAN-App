const exp = require('express');
const bodyParser = require('body-parser');

const app = exp();
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', exp.static('/public'));

var db;

MongoClient.connect("mongodb://krishprasadar:mlabdb@ds033076.mlab.com:33076/kpsample", (err, database) => {
    if (err) return console.log(err);
    db = database;
    var port = process.env.PORT || 4000;
    app.listen(process.env.PORT || 4000, function () {
        console.log("Listening on port" port);
    })
});

app.get("/public/js/home.js", (req, res) => {
    res.sendFile(__dirname + "/public/js/home.js");
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.post('/app/addTodo', (req, res) => {
    db.collection('todos').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.json(result)
    });
});

app.post('/app/deleteTodo', (req, res) => {
    db.collection('todos').deleteOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log("Todo successfully deleted!")
        res.json(result)
        //return success or failure
    })
});

app.get('/app/getTodos', (req, res) => {
    db.collection('todos').find().toArray((err, result) => {
        if (err) return console.log(err)

        res.json(result)
    })
});







