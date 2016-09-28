var users = require('../controllers/users.server.controller');

module.exports = function(app) {

app.get('/', users.homepage);

app.route('/api/users')
    .get(users.findAll)
    .post(users.create);

app.route('/api/users/:userId')
    .get(users.show)
    .put(users.authenticateJwt, users.update)
    .delete(users.destroy);

app.route('/api/createJwt')
    .post(users.createJwt);

// Finish with setting up the userId param
// Note: the users.find function will be called everytime then it will call the next function.
app.param('userId', users.find);

}