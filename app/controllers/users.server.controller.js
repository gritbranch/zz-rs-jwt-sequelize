var sequelize = require('../../config/sequelize');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.homepage = function(req, res) {
	
    //first argument is the name of your EJS template without the .ejs extension, and the second argument is an object containing your template variables
	res.render('index', {
		title: 'Das Auto',
        header: 'Jason Web Token'
  	})

}

exports.create = function(req, res) {
        
    User.create({ username: req.body.username, password: req.body.password, admin: true }).then(function(user) {
      res.json({ success: true });
    }).catch(function (err) {
      return res.send('Something went wrong during create.', { 
            errors: err,
            status: 500
        });
    });
    
};

exports.findAll = function(req, res) {
    
    User.findAll().then(function(users){
      res.json(users);
    }).catch(function (err) {
      return res.send('Something went wrong during findAll.', { 
            errors: err,
            status: 500
        });
    });

};

exports.find = function(req, res, next, id) {
    
    User.find({where: {id: id}}).then(function(user){
        if(!user) {
            return next(new Error('Failed to load user ' + id));
        } else {
            req.user = user;
            //return next();
            next(); return user; // to avoid promise was not returned error.            
        }
        
    }).catch(function(err){
        return next(err);
    });

};

exports.show = function(req, res) {
    
    return res.json(req.user);

};

exports.update = function(req, res) {

    var user = req.user;

    user.updateAttributes({
        username: req.body.username,
        password: req.body.password
    }).then(function(a){
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });

};

exports.destroy = function(req, res) {

    var user = req.user;

    user.destroy().then(function(){
        return res.json(user);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.createJwt = function (req, res) {
    
    //find user
    User.find({where: {username: req.body.username}}).then(function(user){
        if(!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                var token = jwt.sign(user.dataValues, config.jwtSecretKey, {
                    expiresIn : 60*24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }

    }).catch(function(err){
        return err;
    });

};

exports.authenticateJwt = function (req, res, next) {
    
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.jwtSecretKey, function(err, decoded) {      
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
        }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }



};
