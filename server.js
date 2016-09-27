var express = require('express');
var bodyParser  = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');

//DATABASE
//Connection String
var sequelize = new Sequelize('rs-jwt-sequelize-dev', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

//Crate a User model
var User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  admin: {
    type: Sequelize.BOOLEAN
  }
});

//Creates a DB if it doesn't exist
sequelize.sync();

//DB Authentication
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

//EXPRESS
//Configurations
var app = express();
var port = Number(process.env.PORT) || 3000;

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/../public/'));  

//Secret variable for JWT
app.set('superSecret', 'ssshhh');

//Use body parser so we can get info from POST and/or URL parameters. A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). 
//This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({ extended: false }));
//Returns middleware that only parses json
app.use(bodyParser.json());

//Use morgan to log requests to the console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
}

//Controllers
var indexPage = function(req, res) {
	//first argument is the name of your EJS template without the .ejs extension, and the second argument is an object containing your template variables
	res.render('index', {
		title: 'Das Auto',
        message: 'Sample Message'
  	})
}

var create = function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    
    User.create({ username: username, password: password, admin: true }).then(function(user) {
      console.log('Im BATMAN!!!');
      res.json({ success: true });
    }).catch(function (err) {
      return res.send('Something went wrong! - /create', { 
            errors: err,
            status: 500
        });
    });
};

var findAllEjs = function(req, res) {
    User.findAll().then(function(users){
      console.log('Im BATMAN!!!');
	    res.render('view', {
		    title: 'Das Auto',
            users: users
  	    })
    }).catch(function (err) {
      return res.send('Something went wrong! - /read', { 
            errors: err,
            status: 500
        });
    });
};

var findAll = function(req, res) {
    User.findAll().then(function(users){
      console.log('Im BATMAN!!!');
      res.json(users);
    }).catch(function (err) {
      return res.send('Something went wrong! - /read', { 
            errors: err,
            status: 500
        });
    });
};

var find = function(req, res, next, id) {
    console.log('id => ' + id);
    User.find({where: {id: id}}).then(function(user){
        if(!user) {
            return next(new Error('Failed to load user ' + id));
        } else {
            req.user = user;
            return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};

var show = function(req, res) {
    return res.json(req.user);
};

var destroy = function(req, res) {

    var user = req.user;

    User.destroy().then(function(){
        return res.json(user);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

app.param('userId', find);

//Routes
app.route('/api/users')
    .get(findAll)
    .post(create);
app.route('/api/users/:userId')
    .get(show)
    .put(update) // not yet working
    .delete(destroy); // not yet working

// Finish with setting up the userId param
// Note: the articles.article function will be called everytime then it will call the next function.
app.param('userId', find);

app.get('/', indexPage);
//app.get('/', function(req, res) {
//    res.send('Hello! The API is at http://localhost:' + port + '/api');
//});

app.listen(port);
console.log('Server running at http://localhost:' + port +'/');