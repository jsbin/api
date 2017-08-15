const Sequelize = require('sequelize');
const sequelize = require('./');

const Bin = sequelize.define(
  'bin',
  {
    url: {
      type: Sequelize.STRING, // 255
      field: 'url',
    },
    revision: {
      type: Sequelize.BIGINT(11),
      field: 'revision',
    },
    active: {
      type: Sequelize.ENUM('y', 'n'),
    },
    javascript: {
      type: Sequelize.TEXT,
      field: 'javascript',
    },
    html: {
      type: Sequelize.TEXT,
      field: 'html',
    },
    css: {
      type: Sequelize.TEXT,
      field: 'css',
    },
    settings: {
      type: Sequelize.TEXT, // actually JSON text
    },
  },
  {
    freezeTableName: false,
    tableName: 'sandbox',
  }
);

module.exports = Bin;
