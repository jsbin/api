const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const Customer = require('./customer');
const Bins = require('./user-bin');

const sequelize = require('./');

const User = sequelize.define(
  'user',
  {
    username: {
      type: Sequelize.STRING,
      field: 'name',
      primaryKey: true,
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
    apiKey: {
      type: Sequelize.STRING,
      field: 'api_key',
    },
    pro: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    freezeTableName: false,
    tableName: 'ownership',
  }
);

User.prototype.generateBearer = function(expiresIn = '30d') {
  const { id, username, githubToken, pro, settings } = this.get({
    plain: true,
  });
  return jwt.sign(
    { id, username, pro, githubToken, settings },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

User.hasOne(Customer, { foreignKey: 'username' });
User.hasMany(Bins, { foreignKey: 'username' });

module.exports = User;
