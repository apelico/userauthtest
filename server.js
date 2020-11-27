require('dotenv').config()
const PORT = process.env.PORT || 3000;
var express = require('express'),
http = require('http');
var app = express();
var server = http.createServer(app);

const path = require('path');
const bodyParser = require('body-parser')
app.use(bodyParser.json({
  limit: '5mb',
  type: 'application/json'
}));

//Posts
app.get(('/api/getPosts'), (req,res) => {
  res.json('success');
});

app.post(('/api/createPost'), (req,res) => {
  print(req.body);
  //database.insertOne(req.body);
  res.json('success');
});

//Database
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var uri = process.env.MONGODB_URI;

var database;

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, db) {
  if (!err) {
    console.log('Connection established to', uri);
    database = db.db('Social-Ppp').collection('posts');
  } else {
    console.log("Failed to connect", uri);
  };
});



// listen (start app with node server.js)
server.listen(PORT);

app.use(express.static(__dirname + '/dist/social-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/social-app/index.html'));
});