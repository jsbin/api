const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const sequelize = require('./');

const User = sequelize.define(
  'user',
  {
    username: {
      type: Sequelize.STRING,
      field: 'name',
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
    },
    githubId: {
      type: Sequelize.STRING,
      field: 'github_id',
    },
    githubToken: {
      type: Sequelize.STRING,
      field: 'github_token',
    },
    apikey: {
      type: Sequelize.STRING,
      field: 'apikey',
    },
    pro: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    instanceMethods: {
      generateBearer: function(expiresIn = '1 hour') {
        const { id, username, github_token, pro, settings } = this.get({
          plain: true,
        });
        return jwt.sign(
          { id, username, pro, github: github_token, settings },
          process.env.JWT_SECRET,
          { expiresIn }
        );
      },
    },
    freezeTableName: false,
    tableName: 'ownership',
  }
);

module.exports = User;
