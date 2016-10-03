var users = require('../controllers/users.server.controller');

module.exports = function(app) {

//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

app.get('/', users.homepage);

app.route('/api/signup')
    .post(users.create);

app.route('/api/signin')
    .post(users.createJwt);

app.route('/api/users')
    .get(users.authenticateJwt, users.findAll);

app.route('/api/users/:userId')
    .get(users.authenticateJwt, users.show)
    .put(users.authenticateJwt, users.update)
    .delete(users.authenticateJwt, users.destroy);

// Finish with setting up the userId param
// Note: the users.find function will be called everytime then it will call the next function.
app.param('userId', users.find);

}