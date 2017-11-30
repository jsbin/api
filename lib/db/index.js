const Sequelize = require('sequelize');
const options = {
  define: {
    timestamps: false, // true by default
  },
};

if (!process.env.DB_LOGGING || false) {
  options.logging = false;
}

const sequelize = new Sequelize(process.env.DB, options);

sequelize
  .authenticate()
  .then(() => {
    console.log('connected to db');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
