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

  database.distinct('user.posts',{'user.posts': {$exists: true}}, function(err, data) {
    res.json(data)
  });

});

app.post(('/api/createPost'), autenticateToken,(req,res) => {
  const username = req.user.username.toLowerCase();

  var post = req.body.post;
  post.order = getNumber();
  post.date = getDate();
  post.time = getTime();
  post.username = username;
  post.title = '';
  post.id = crypto.randomBytes(16).toString('hex');

  database.updateOne({'user.username': username}, {$push: {'user.posts': post}});

  res.json(post);
});

//User Handling
app.post(('/api/register'), (req, res) => {
  let username = req.body.username.toLowerCase();
  req.body.password = encrypt(req.body.password);

  let user = {'user': req.body}
  user['user']['username'] = username;

  database.findOne({[req.body.username]: {$exists: true}}, function(err, data) {
    if(data == null){
      database.insertOne(user);
      return;
    }
    res.send('409'); //Conflict - User already exists
  })

});

app.post(('/api/uploadPicture'), autenticateToken, (req, res) => {
  const username = req.user.username.toLowerCase();

  database.updateOne({'user.username': username}, {$set: {'user.profilePictureURL': req.body.imageURL}});
});

app.get(('/api/getAuthenticationData'), autenticateToken, (req, res) => {
  const username = req.user.username.toLowerCase();

  database.findOne({'user.username': username},{projection:{_id: 0, 'user.password': 0}}, function(err, data) {
    if(data != null){
      res.json(data['user']);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });
});


app.post(('/api/getUserData'), (req, res) => {
  const username = req.body.username.toLowerCase();

  database.findOne({'user.username': username}, {projection:{_id: 0, 'user.password': 0}}, function(err, data) {
    if(data != null){
      res.json(data['user']);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });
});

app.post(('/api/getUserSnippet'), (req, res) => {
  const username = req.body.username.toLowerCase();

  database.findOne({'user.username': username}, {projection:{_id: 0, 'user.password': 0, 'user.posts': 0, 'user.friends': 0}}, function(err, data) {
    if(data != null){
      res.json(data['user']);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });
});

app.get(('/api/getFriends'), autenticateToken, (req,res) => {
  const username = req.user.username.toLowerCase();
  
  database.findOne({'user.username': username}, {projection:{_id: 0, 'user.password': 0, 'user.posts': 0}}, function(err, data) {
    if(data != null){
      res.json(data['user']);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });

});

//relationship handling
app.post(('/api/addUser'), autenticateToken, (req, res) => {

  const usernameOne = req.user.username.toLowerCase();
  const usernameTwo = req.body.usernameOne.toLowerCase();

  let request = {'usernameOne': usernameOne, 'usernameTwo': usernameTwo, status: 1};

  relationshipDB.findOne({ $or: [{'usernameOne': usernameOne, 'usernameTwo': usernameTwo}, {'usernameOne': usernameTwo, 'usernameTwo': usernameOne}]}, function(err, data) {
    if(data == null){
      relationshipDB.insertOne(request);
      return;
    }

    relationshipDB.updateOne({ $or: [{'usernameOne': usernameOne, 'usernameTwo': usernameTwo}, {'usernameOne': usernameTwo, 'usernameTwo': usernameOne}]}, {$set: {'status': 2}});
    var messengerID = crypto.randomBytes(16).toString('hex');
    database.updateOne({'user.username': usernameOne}, {$push: {'user.friends': {'username': usernameTwo, 'messengerID': messengerID}}});
    database.updateOne({'user.username': usernameTwo}, {$push: {'user.friends': {'username': usernameOne, 'messengerID': messengerID}}});

    messengerDB.insertOne({'messengerID': messengerID});
  });
});

app.post(('/api/checkRelationship'), autenticateToken, (req, res) => {
  const usernameOne = req.user.username.toLowerCase();
  const usernameTwo = req.body.usernameOne.toLowerCase();
  
  if(usernameOne == usernameTwo){
    res.send('401');
    return;
  }

  relationshipDB.findOne({ $or: [{'usernameOne': usernameOne, 'usernameTwo': usernameTwo}, {'usernameOne': usernameTwo, 'usernameTwo': usernameOne}]}, function(err, data) {
    if(data != null){
      res.send(data);
      return;
    }

    res.send('404'); //Not Found - User does not exist
  });
});

app.get(('/api/isTokenAuthorized'), autenticateToken, (req,res) => {
  //Sends 401 or 404 depending on invalid Token Status
  res.json(req.user.username.toLowerCase()); //sucess if token is valid
});


//JSON Auth
const jwt = require('jsonwebtoken')

app.post(('/api/login'), (req,res) => {
  const username = req.body.username.toLowerCase();
  const user = { username: username }
  const accessToken = generateAccessToken(user);
  var condition = `user.${[req.body.username]}`;

  database.findOne({'user.username': username}, function(err, data) {
    if(data != null) {
      if(req.body.password === decrypt(data['user']['password'])){
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
  return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '15m'});
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

//Messenger Services
var io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on("new-message", res => {
    console.log(res);

    messengerDB.updateOne({'messengerID': res.messengerID}, {$push: {'messages': {'sender': res.sender, 'message': res.message}}});

    io.emit("new-message:" + res.messengerID,{'message':res.message, 'sender': res.sender});
  });

});

app.post(('/api/getMesseges'), autenticateToken, (req,res) => {
  messengerDB.findOne({'messengerID': req.body.messengerID}, function(err, data) {
    if(data != null){
      res.json(data);
      return;
    }
    res.send('404'); //Not Found - User does not exist
  });

});

//Database
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var uri = process.env.MONGODB_URI;

var database;
var relationshipDB;
var messengerDB;

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, db) {
  if (!err) {
    console.log('Connection established to', uri);
    database = db.db('Social-App').collection('database');
    relationshipDB = db.db('Social-App').collection('relationships');
    messengerDB = db.db('Social-App').collection('messenger');
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

function getNumber() {
  var date = new Date();
  return date.getTime();
}

//Get Current date and time
function getDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();

  return month + "/" + day + "/" + year;
}

function getTime() {
  var date = new Date();
  
  var minute = date.getMinutes();
  if (minute <= 9) {
    minute = "0" + minute;
  }

  var hour = date.getHours();
  var time = 'AM';
  if (hour > 12) {
    hour -= 12;
    time = 'PM'
  }

  return hour + ':' + minute + ' '+ time
}



// listen (start app with node server.js)
server.listen(PORT);

app.use(express.static(__dirname + '/dist/social-app'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/social-app/index.html'));
});