const Sequelize = require('sequelize');
const User = require('./user');
const sequelize = require('./');

const Customer = sequelize.define(
  'customer',
  {
    stripeId: {
      type: Sequelize.STRING,
      field: 'stripe_id',
    },
    username: {
      type: Sequelize.STRING,
      field: 'name',
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
    plan: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: false,
    tableName: 'customers',
  }
);

Customer.belongsTo(User, { foreignKey: 'username' });
User.hasOne(Customer, { foreignKey: 'username' });

module.exports = Customer;
