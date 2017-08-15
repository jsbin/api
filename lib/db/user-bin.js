const Sequelize = require('sequelize');
const sequelize = require('./');

const Bins = sequelize.define(
  'Bins',
  {
    username: {
      type: Sequelize.STRING,
      field: 'name',
    },
    url: {
      type: Sequelize.STRING,
    },
    revision: {
      type: Sequelize.BIGINT(11),
    },
    date: {
      type: Sequelize.DATE,
      field: 'last_updated',
    },
    summary: {
      type: Sequelize.STRING,
    },
    archived: {
      type: Sequelize.BOOLEAN,
      field: 'archive',
    },
    visibility: {
      type: Sequelize.ENUM('public', 'unlisted', 'private'),
    },
  },
  {
    freezeTableName: false,
    tableName: 'owners', // I hate past me
  }
);

module.exports = Bins;
