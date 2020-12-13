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

//User posts
app.get(('/api/getPosts'), (req,res) => {
  res.json('success');
});

app.post(('/api/createPost'), (req,res) => {
  //database.insertOne(req.body);
  res.json('success');
});

//User Handling
app.post(('/api/register'), (req, res) => {
  let username = req.body.username.toLowerCase();
  req.body.password = encrypt(req.body.password);

  let user = {[username]: req.body}

  database.findOne({[req.body.username]: {$exists: true}}, function(err, data) {
    if(data == null){
      database.insertOne(user);
      return;
    }
    res.send('409'); //Conflict - User already exists
  })

});

app.get(('/api/getAuthenticationData'), autenticateToken, (req, res) => {
  var condition = `${[req.user.username]}.password`;

  database.findOne({[req.user.username]: {$exists: true}},{projection:{_id: 0, [condition]: 0}}, function(err, data) {
    if(data != null){
      res.json(data[req.user.username]);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });
})

app.post(('/api/getUserData'), (req, res) => {
  var condition = `${[req.body.username]}.password`;

  database.findOne({[req.body.username]: {$exists: true}}, {projection:{_id: 0, [condition]: 0}}, function(err, data) {
    if(data != null){
      res.json(data[req.body.username]);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });
});

//JSON Auth
const jwt = require('jsonwebtoken')

app.post(('/api/login'), (req,res) => {
  const username = req.body.username.toLowerCase();
  const user = { username: username }
  const accessToken = generateAccessToken(user);

  database.findOne({[username]: {$exists: true}}, function(err, data) {
    if(data != null) {
      if(req.body.password === decrypt(data[[username]]['password'])){
        res.json( {accessToken: accessToken} );
      }else{
        res.send('401'); //Unautorized - Password is incorrect
      }
    }else{
      res.send('404'); //Not Found - User does not exist
    }
  });

});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '15s'});
}

function autenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (token == null) return res.send('401'); //Unautorized - Token is null

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if(err) return res.send('401'); //Unautorized - Token has expired
    req.user = user;
    next();
  });
}

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
    database = db.db('Social-App').collection('database');
  } else {
    console.log("Failed to connect", uri);
  };
});

// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;

function encrypt(text) {
  iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return (iv.toString('hex') + encrypted.toString('hex')).toString();
}

function decrypt(code) {
  let text = split(code);
  let iv = Buffer.from(text[0], 'hex');
  let encryptedText = Buffer.from(text[1], 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function split(value) {
  const textParts = [value.slice(0,32), value.slice(32,64)]
  return textParts;
}



// listen (start app with node server.js)
server.listen(PORT);

app.use(express.static(__dirname + '/dist/social-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/social-app/index.html'));
});