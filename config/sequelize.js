var Sequelize = require('sequelize');
var config = require('./config');

var db = {};

module.exports = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  port: config.db.port,
  pool: config.db.pool
});
