const Sequelize = require('sequelize');
const sequelize = require('./');

const Customer = sequelize.define(
  'customer',
  {
    stripeId: {
      type: Sequelize.STRING,
      field: 'stripe_id',
      primaryKey: true,
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

module.exports = Customer;
