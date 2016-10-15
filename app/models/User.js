var Sequelize = require('sequelize');
var sequelize = require('../../config/sequelize');     
var crypto = require('crypto');

module.exports = sequelize.define('User', {
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN
    }
  },
	{   
    instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) {
                        return '';
                    }
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
			  },				
        authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.password;
				}
	  }
  }
);