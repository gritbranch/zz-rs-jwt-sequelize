var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');     

module.exports = sequelize.define('User', {
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