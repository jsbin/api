const Sequelize = require('sequelize');
const slugger = require('jsbin-id');
const sequelize = require('./');

const Bin = sequelize.define(
  'bin',
  {
    url: {
      type: Sequelize.STRING, // 255
      field: 'url',
      defaultValue: slugger,
      required: true,
    },
    revision: {
      type: Sequelize.BIGINT(11),
      field: 'revision',
      defaultValue: 1,
    },
    active: {
      type: Sequelize.ENUM('y', 'n'),
      defaultValue: 'y',
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
    hooks: {
      beforeValidate: (bin, options) => {
        if (!bin.settings) {
          bin.settings = {};
        }

        bin.settings = JSON.stringify(bin.settings);
      },
    },
  }
);

module.exports = Bin;
