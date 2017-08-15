require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB, {
  logging: !!process.env.DB_LOGGING || false,
  define: {
    timestamps: false, // true by default
  },
});

sequelize.authenticate().catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
